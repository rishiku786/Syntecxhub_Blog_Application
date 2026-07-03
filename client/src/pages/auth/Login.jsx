import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div className="animate-blob" style={{ position: 'absolute', top: '10%', left: '5%', width: '20rem', height: '20rem', background: 'radial-gradient(circle,rgba(226,55,68,0.2) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
      <div className="animate-blob animation-delay-2000" style={{ position: 'absolute', bottom: '10%', right: '5%', width: '22rem', height: '22rem', background: 'radial-gradient(circle,rgba(255,126,139,0.15) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.5rem', padding: '2.5rem 2rem', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <div className="gradient-bg" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>B</span>
              </div>
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Email"
              type="email"
              icon={<HiMail />}
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<HiLockClosed />}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  bottom: '0.7rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                {showPassword ? <HiEyeOff style={{ fontSize: '1.05rem' }} /> : <HiEye style={{ fontSize: '1.05rem' }} />}
              </button>
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ff7e8b', textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: '#ff7e8b', textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
