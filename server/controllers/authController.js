import crypto from 'crypto';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
  clearTokenCookies,
} from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // All registered users get 'author' role by default (allows reading and writing)
    const allowedRole = 'author';

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // If remember me, extend refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  clearTokenCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new AppError('No refresh token', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    const newAccessToken = generateAccessToken(user._id);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (error) {
    clearTokenCookies(res);
    next(new AppError('Invalid refresh token', 401));
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('No user found with that email', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'BlogVerse - Password Reset',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;border-radius:8px;text-decoration:none;">
            Reset Password
          </a>
          <p>This link expires in 30 minutes.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });

      res.json({ success: true, message: 'Reset email sent' });
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
