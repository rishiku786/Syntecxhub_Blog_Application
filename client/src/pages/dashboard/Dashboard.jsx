import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiDocumentText, HiHeart, HiEye, HiUsers, HiPencil, HiTrendingUp } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { blogService } from '../../services/blogService';
import { getMonthName } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getStats().then(({ data }) => {
      setStats(data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Blogs', value: stats.totalBlogs, icon: <HiDocumentText />, iconColor: 'text-primary-500', iconBg: 'bg-primary-500/10 dark:bg-primary-500/20', change: '+12%' },
    { label: 'Published', value: stats.publishedBlogs, icon: <HiTrendingUp />, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20', change: '+8%' },
    { label: 'Drafts', value: stats.draftBlogs, icon: <HiPencil />, iconColor: 'text-amber-500', iconBg: 'bg-amber-500/10 dark:bg-amber-500/20', change: '' },
    { label: 'Total Likes', value: stats.totalLikes, icon: <HiHeart />, iconColor: 'text-pink-500', iconBg: 'bg-pink-500/10 dark:bg-pink-500/20', change: '+24%' },
    { label: 'Total Views', value: stats.totalViews, icon: <HiEye />, iconColor: 'text-blue-500', iconBg: 'bg-blue-500/10 dark:bg-blue-500/20', change: '+18%' },
    { label: 'Followers', value: stats.followers, icon: <HiUsers />, iconColor: 'text-rose-500', iconBg: 'bg-rose-500/10 dark:bg-rose-500/20', change: '+5%' },
  ] : [];

  const chartData = stats?.monthlyPosts?.map((m) => ({
    month: getMonthName(m._id),
    posts: m.count,
  })) || [];

  const displayChartData = chartData.length > 0 ? chartData : [
    { month: 'Jan', posts: 2 },
    { month: 'Feb', posts: 5 },
    { month: 'Mar', posts: 3 },
    { month: 'Apr', posts: 8 },
    { month: 'May', posts: 6 },
    { month: 'Jun', posts: 10 },
  ];
  const isMockChart = chartData.length === 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-28 sm:h-32 rounded-2xl" />)}
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-poppins mb-2">Dashboard</h1>
      <p className="text-content-light-muted dark:text-content-dark-muted" style={{ marginBottom: '2.5rem' }}>Welcome back! Here&apos;s your overview.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
            }}
            whileHover={{
              y: -5,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
            }}
            transition={{
              type: 'tween',
              duration: 0.15,
              ease: 'easeOut',
              delay: 0
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '1.5rem',
              borderRadius: '1.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-main)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                <span className="text-xl block">{card.icon}</span>
              </div>
              {card.change && card.value > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }} className="bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  {card.change}
                </span>
              )}
            </div>
            
            <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: '"Poppins", sans-serif', lineHeight: 1.1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontWeight: 550 }}>
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden"
        style={{
          padding: '2rem',
          marginTop: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '1.25rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6" style={{ paddingLeft: '0.5rem' }}>
          <div>
            <h3 className="text-lg font-bold font-poppins text-content-light dark:text-content-dark">Monthly Post Activity</h3>
            <p className="text-xs text-content-light-muted dark:text-content-dark-muted">
              {isMockChart ? 'No post data yet. Showing a sample overview.' : 'Overview of your writing output.'}
            </p>
          </div>
          {isMockChart && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded-full">
              Sample View
            </span>
          )}
        </div>
        
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e23744" stopOpacity={isMockChart ? 0.12 : 0.3} />
                  <stop offset="95%" stopColor="#e23744" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} />
              <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#374151'} fontSize={11} tickLine={false} axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
              <YAxis stroke={isDark ? '#94a3b8' : '#374151'} fontSize={11} tickLine={false} axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1a1128' : '#ffffff',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 55, 68, 0.15)',
                  boxShadow: 'var(--shadow)',
                  color: isDark ? '#f1f5f9' : '#1e1b4b',
                }}
                itemStyle={{ color: '#e23744' }}
                labelStyle={{ color: isDark ? '#f1f5f9' : '#1e1b4b', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="posts" 
                stroke="#e23744" 
                strokeWidth={2.5} 
                strokeOpacity={isMockChart ? 0.35 : 1}
                strokeDasharray={isMockChart ? "5 5" : undefined}
                fill="url(#colorPosts)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
