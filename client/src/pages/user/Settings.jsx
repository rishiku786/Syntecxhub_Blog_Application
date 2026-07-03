import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed, HiTrash } from 'react-icons/hi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put('/users/profile', { password: passwords.newPassword });
      toast.success('Password updated!');
      setPasswords({ current: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bv-container" style={{ maxWidth: '720px', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '2rem' }}>Settings</h1>

        {/* Change Password */}
        <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-main)', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ padding: '0.65rem', borderRadius: '0.75rem', background: 'rgba(124,58,237,0.15)' }}>
              <HiLockClosed className="text-xl text-primary-400" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', color: 'var(--text-main)' }}>Change Password</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
            />
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-main)', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '0.65rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.15)' }}>
              <HiTrash className="text-xl text-red-500" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', color: '#ef4444' }}>Danger Zone</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Irreversible actions</p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.6 }}>
            Deleting your account will permanently remove all your data, blogs, and comments.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Are you sure? This action cannot be undone.')) {
                toast.error('Account deletion is disabled in demo mode');
              }
            }}
          >
            Delete My Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
