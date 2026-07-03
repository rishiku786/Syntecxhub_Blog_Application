import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'author' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { name, email, password, role } = form;
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div className="animate-blob" style={{ position: 'absolute', top: '5%', right: '5%', width: '20rem', height: '20rem', background: 'radial-gradient(circle,rgba(226,55,68,0.2) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />
      <div className="animate-blob animation-delay-4000" style={{ position: 'absolute', bottom: '5%', left: '5%', width: '22rem', height: '22rem', background: 'radial-gradient(circle,rgba(255,126,139,0.15) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '35rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ background: 'var(--bg-card)', borderRadius: '1.5rem', padding: '1.75rem 2rem', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', textDecoration: 'none' }}>
              <div className="gradient-bg" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>B</span>
              </div>
            </Link>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Create Account 🚀</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Join the community of amazing writers</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            
            {/* Row 1: Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
              <Input
                label="Full Name"
                icon={<HiUser />}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                icon={<HiMail />}
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Row 2: Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
              <div style={{ position: 'relative' }}>
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
                    zIndex: 11,
                  }}
                >
                  {showPassword ? <HiEyeOff style={{ fontSize: '1.05rem' }} /> : <HiEye style={{ fontSize: '1.05rem' }} />}
                </button>
              </div>
              <Input
                label="Confirm Password"
                type="password"
                icon={<HiLockClosed />}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg" style={{ marginTop: '0.5rem', height: '2.6rem' }}>
              Create Account
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', marginTop: '1.1rem', color: 'var(--text-muted)', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: '#ff7e8b', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
