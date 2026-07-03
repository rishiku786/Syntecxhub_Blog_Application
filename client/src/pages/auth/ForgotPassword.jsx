import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/blogService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div className="animate-blob" style={{ position: 'absolute', top: '20%', left: '10%', width: '22rem', height: '22rem', background: 'radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.5rem', padding: '2.5rem 2rem', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
          {sent ? (
            <>
              <span style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block' }}>📧</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Check Your Email</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" className="w-full">Back to Login</Button>
              </Link>
            </>
          ) : (
            <>
              <span style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block' }}>🔐</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Forgot Password?</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Input
                  type="email"
                  icon={<HiMail />}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Send Reset Link
                </Button>
              </form>
              <Link to="/login" style={{ display: 'block', marginTop: '1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#a78bfa', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
