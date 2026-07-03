import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentText, HiChartBar, HiPencil, HiCog, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const sidebarLinks = [
    { icon: <HiChartBar />, label: 'Overview', path: '/dashboard' },
    { icon: <HiDocumentText />, label: 'My Blogs', path: '/dashboard/my-blogs' },
    { icon: <HiPencil />, label: 'Write New', path: '/create' },
    { icon: <HiCog />, label: 'Settings', path: '/settings' },
  ];

  if (isAdmin) {
    sidebarLinks.push(
      { icon: <HiChartBar />, label: 'Admin Panel', path: '/admin' }
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        display: 'none',
        flexDirection: 'column',
        width: '16rem',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-main)',
        padding: '1.5rem',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 10,
      }} className="lg-flex">
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <div className="gradient-bg" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>B</span>
          </div>
          <span className="gradient-text" style={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            BlogVerse
          </span>
        </Link>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ff7e8b'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <HiArrowLeft /> Back to Home
        </button>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.88rem',
                  fontWeight: 550,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive ? 'linear-gradient(135deg, #e23744, #ff7e8b)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 4px 16px rgba(226, 55, 68, 0.25)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(226, 55, 68, 0.08)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-main)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
              alt={user?.name}
              style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: '2px solid rgba(226, 55, 68, 0.3)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }} className="lg-ml-64">
        {/* Top bar for mobile */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
        }} className="lg-hidden">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <div className="gradient-bg" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>B</span>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {sidebarLinks.slice(0, 3).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? 'linear-gradient(135deg, #e23744, #ff7e8b)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '1.15rem' }}>{link.icon}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '2rem 1.25rem' }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
