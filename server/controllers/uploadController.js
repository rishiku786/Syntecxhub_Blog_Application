import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

// @desc    Upload image (supports Cloudinary and local fallback)
// @route   POST /api/upload
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    // Check if Cloudinary is configured (not placeholders)
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      process.env.CLOUDINARY_API_SECRET && 
      process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    if (isCloudinaryConfigured) {
      // Convert buffer to base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'blogverse',
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } else {
      // Fallback to local storage
      const fileExt = path.extname(req.file.originalname) || '.png';
      const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
      const uploadsDir = path.join(process.cwd(), 'uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, req.file.buffer);

      const serverUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFilename}`;

      return res.json({
        success: true,
        url: serverUrl,
        public_id: `local_${uniqueFilename}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image (supports Cloudinary and local fallback)
// @route   DELETE /api/upload
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return next(new AppError('No public_id provided', 400));

    if (public_id.startsWith('local_')) {
      const filename = public_id.replace('local_', '');
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.json({ success: true, message: 'Local image deleted' });
    } else {
      await cloudinary.uploader.destroy(public_id);
      return res.json({ success: true, message: 'Image deleted' });
    }
  } catch (error) {
    next(error);
  }
};
