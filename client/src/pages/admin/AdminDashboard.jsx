import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUsers, HiDocumentText, HiTrendingUp, HiTrash, HiEye } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { blogService, userService, categoryService } from '../../services/blogService';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [catModal, setCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: '📝', color: '#7c3aed' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, catRes] = await Promise.all([
        blogService.getAdminStats(),
        userService.getAll({ limit: 50 }),
        categoryService.getAll(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setCategories(catRes.data.categories || []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their blogs?')) return;
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await userService.updateRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch { toast.error('Failed'); }
  };

  const handleCreateCategory = async () => {
    if (!catForm.name) return toast.error('Name required');
    try {
      const { data } = await categoryService.create(catForm);
      setCategories([...categories, data.category]);
      setCatModal(false);
      setCatForm({ name: '', description: '', icon: '📝', color: '#7c3aed' });
      toast.success('Category created!');
    } catch { toast.error('Failed'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed'); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'categories', label: 'Categories' },
  ];

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>;
  }

  const roleColor = { admin: 'red', author: 'purple', reader: 'blue' };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-2">Admin Panel</h1>
      <p className="text-content-light-muted dark:text-content-dark-muted mb-6 sm:mb-8">Manage your platform</p>

      {/* Tabs — scrollable on mobile */}
      <div className="filter-scroll mb-6 sm:mb-8">
        <div className="flex gap-2 w-max">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '0.75rem',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', border: 'none', transition: 'all 0.15s',
                background: tab === t.id ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'var(--bg-card)',
                color: tab === t.id ? '#fff' : 'var(--text-muted)',
                boxShadow: tab === t.id ? '0 4px 16px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {tab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: <HiUsers />, color: 'from-primary-500 to-accent-indigo' },
              { label: 'Total Blogs', value: stats.totalBlogs, icon: <HiDocumentText />, color: 'from-emerald-500 to-teal-500' },
              { label: 'Published', value: stats.totalPublished, icon: <HiTrendingUp />, color: 'from-pink-500 to-rose-500' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-surface-dark-2 border border-primary-50 dark:border-glass-border-dark shadow-sm"
              >
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white mb-3`}>
                  <span className="text-xl">{card.icon}</span>
                </div>
                <p className="text-3xl font-bold font-poppins">{card.value}</p>
                <p className="text-sm text-content-light-muted dark:text-content-dark-muted">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Popular Blogs */}
          {stats.popularBlogs?.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark-2 border border-primary-50 dark:border-glass-border-dark">
              <h3 className="text-lg font-bold font-poppins mb-4">Popular Blogs</h3>
              <div className="space-y-3">
                {stats.popularBlogs.map((blog, i) => (
                  <div key={blog._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-light-2 dark:hover:bg-surface-dark-3 transition-colors">
                    <span className="text-lg font-bold text-primary-400">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{blog.title}</p>
                      <p className="text-xs text-content-light-muted">{blog.author?.name} • {blog.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark-2 border border-primary-50 dark:border-glass-border-dark overflow-x-auto">
          <h3 className="text-lg font-bold font-poppins mb-4">All Users ({users.length})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-100 dark:border-glass-border-dark">
                <th className="text-left py-3 px-2">User</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Role</th>
                <th className="text-left py-3 px-2">Joined</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-primary-50 dark:border-glass-border-dark hover:bg-surface-light-2 dark:hover:bg-surface-dark-3">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-full" />
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-content-light-muted dark:text-content-dark-muted">{u.email}</td>
                  <td className="py-3 px-2">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg bg-surface-light-2 dark:bg-surface-dark-3 border border-primary-200 dark:border-glass-border-dark cursor-pointer"
                    >
                      <option value="reader">Reader</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 text-content-light-muted text-xs">{formatDateShort(u.createdAt)}</td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
                      <HiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark-2 border border-primary-50 dark:border-glass-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-poppins">Categories ({categories.length})</h3>
            <Button size="sm" onClick={() => setCatModal(true)}>+ Add Category</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-4 rounded-xl bg-surface-light-2 dark:bg-surface-dark-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    {cat.description && <p className="text-xs text-content-light-muted">{cat.description}</p>}
                  </div>
                </div>
                <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer">
                  <HiTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>

          <Modal isOpen={catModal} onClose={() => setCatModal(false)} title="Add Category" size="sm">
            <div className="space-y-4">
              <Input label="Name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Technology" />
              <Input label="Description" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Brief description" />
              <Input label="Icon (emoji)" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="💻" />
              <Button onClick={handleCreateCategory} className="w-full">Create Category</Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
