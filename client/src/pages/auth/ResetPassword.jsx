import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/blogService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div className="animate-blob" style={{ position: 'absolute', top: '20%', left: '10%', width: '22rem', height: '22rem', background: 'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.5rem', padding: '2.5rem 2rem', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block' }}>🔑</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Enter your new password below
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <Input
              label="New Password"
              type="password"
              icon={<HiLockClosed />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={<HiLockClosed />}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Reset Password
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
