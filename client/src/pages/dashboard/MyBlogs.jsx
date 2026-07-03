import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiEye, HiPlus } from 'react-icons/hi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      const { data } = await blogService.getMyBlogs(params);
      setBlogs(data.blogs || []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await blogService.delete(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success('Blog deleted');
    } catch { toast.error('Delete failed'); }
  };

  const statusColor = { published: 'green', draft: 'amber', scheduled: 'blue' };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '1.25rem' }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-poppins">My Blogs</h1>
        <Link to="/create">
          <Button icon={<HiPlus />} size="lg">New Post</Button>
        </Link>
      </div>

      {/* Filter Tabs — scrollable on mobile */}
      <div className="filter-scroll" style={{ marginBottom: '1.25rem' }}>
        <div className="flex gap-2 w-max">
          {['', 'published', 'draft'].map((status) => {
            const isActive = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 650,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, #e23744, #ff7e8b)' : 'var(--bg-card)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 4px 16px rgba(226, 55, 68, 0.25)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : blogs.length === 0 ? (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <span style={{ fontSize: '3.5rem', marginBottom: '1.5rem', display: 'block' }}>📝</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: '"Poppins", sans-serif', color: '#fff', margin: '0 0 0.5rem 0' }}>
            No blogs yet
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 2rem 0', maxWidth: '20rem' }}>
            Create your first masterpiece!
          </p>
          <Link to="/create"><Button size="lg">Write Your First Post</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white dark:bg-surface-dark-2 border border-primary-50 dark:border-glass-border-dark hover:shadow-lg transition-all duration-300"
            >
              {blog.coverImage && (
                <img src={blog.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <Link to={`/blog/${blog.slug}`} className="hover:text-primary-500 transition-colors">
                  <h3 className="font-semibold truncate text-sm sm:text-base cursor-pointer">{blog.title}</h3>
                </Link>
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-content-light-muted dark:text-content-dark-muted">
                  <span>{formatDateShort(blog.createdAt)}</span>
                  <span>•</span>
                  <span>{blog.readingTime} min read</span>
                  <Badge color={statusColor[blog.status] || 'gray'}>
                    {blog.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {blog.status === 'published' && (
                  <Link to={`/blog/${blog.slug}`}>
                    <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3 cursor-pointer">
                      <HiEye className="text-lg text-content-light-muted" />
                    </motion.button>
                  </Link>
                )}
                <Link to={`/edit/${blog.slug}`}>
                  <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3 cursor-pointer">
                    <HiPencil className="text-lg text-primary-600" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <HiTrash className="text-lg text-red-500" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
