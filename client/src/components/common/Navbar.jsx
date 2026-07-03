import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiSearch, HiSun, HiMoon, HiPencil, HiLogout, HiUser, HiBookmark, HiChartBar, HiCog } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, isAuthor, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [];

  if (isAuthenticated) {
    navLinks.push(
      { label: 'Home', path: '/' },
      { label: 'Blogs', path: '/blogs' },
      { label: 'Categories', path: '/blogs?view=categories' }
    );
  } else {
    navLinks.push(
      { label: 'Features', path: '#features', isHash: true },
      { label: 'How It Works', path: '#how-it-works', isHash: true },
      { label: 'FAQ', path: '#faq', isHash: true }
    );
  }

  if (isAuthor) {
    navLinks.push({ label: 'Create', path: '/create' });
  }

  const isActiveLink = (link) => {
    if (link.path === '/') {
      return location.pathname === '/';
    }
    if (link.path === '/blogs') {
      return location.pathname === '/blogs' && !location.search.includes('view=categories');
    }
    if (link.path === '/blogs?view=categories') {
      return location.pathname === '/blogs' && location.search.includes('view=categories');
    }
    if (link.path === '/create') {
      return location.pathname === '/create';
    }
    return false;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-lg shadow-primary-500/5'
          : 'bg-transparent'
      }`}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">B</span>
            </motion.div>
            <span className="text-xl font-bold font-poppins brand-text hidden sm:block">
              BlogVerse
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActiveLink(link);
              if (link.isHash) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate('/' + link.path);
                      } else {
                        const element = document.getElementById(link.path.replace('#', ''));
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="text-sm font-medium transition-colors relative group text-content-light-muted dark:text-content-dark-muted hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 group-hover:w-full" />
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative group ${
                    active 
                      ? 'text-primary-600 dark:text-primary-400 font-semibold' 
                      : 'text-content-light-muted dark:text-content-dark-muted hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {link.label}
                  <span 
                     className="absolute -bottom-1 left-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300"
                     style={{
                       width: active ? '100%' : '0%',
                     }}
                  />
                  {!active && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Search */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-surface-dark-3 transition-colors cursor-pointer"
              >
                <HiSearch className="text-xl text-content-light-muted dark:text-content-dark-muted" />
              </motion.button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-surface-dark-3 transition-colors cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <HiSun className="text-xl text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <HiMoon className="text-xl text-primary-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Create Button (author/admin) */}
            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create')}
                className="hidden sm:inline-flex"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #e23744, #ff7e8b)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(226, 55, 68, 0.3)',
                  transition: 'all 0.25s ease',
                  marginRight: '0.4rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <HiPencil style={{ fontSize: '0.95rem' }} /> Create
              </motion.button>
            )}

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full border-2 border-white/20 hover:border-[#ff7e8b] dark:border-white/10 dark:hover:border-[#ff7e8b] transition-all duration-300 object-cover"
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '0.65rem',
                        zIndex: 100,
                        width: '14.5rem',
                        background: 'var(--bg-card)',
                        borderRadius: '1.25rem',
                        border: '1px solid var(--border-main)',
                        boxShadow: 'var(--shadow)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border-main)' }}>
                        <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontFamily: '"Poppins", sans-serif', letterSpacing: '0.02em' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', wordBreak: 'break-all' }}>{user?.email}</p>
                      </div>
                      <div style={{ padding: '0.4rem' }}>
                        <DropdownItem icon={<HiUser />} label="Profile" onClick={() => { navigate(`/profile/${user?._id}`); setIsProfileOpen(false); }} />
                        <DropdownItem icon={<HiBookmark />} label="Bookmarks" onClick={() => { navigate('/bookmarks'); setIsProfileOpen(false); }} />
                        {isAuthor && (
                          <DropdownItem icon={<HiChartBar />} label="Dashboard" onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }} />
                        )}
                        {isAdmin && (
                          <DropdownItem icon={<HiCog />} label="Admin Panel" onClick={() => { navigate('/admin'); setIsProfileOpen(false); }} />
                        )}
                        <DropdownItem icon={<HiCog />} label="Settings" onClick={() => { navigate('/settings'); setIsProfileOpen(false); }} />
                        <div style={{ height: '1px', background: 'var(--border-main)', margin: '0.45rem 0.75rem' }} />
                        <DropdownItem icon={<HiLogout />} label="Logout" onClick={handleLogout} danger />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  style={{
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#ff7e8b',
                    borderRadius: '9999px',
                    border: '1px solid rgba(226,55,68,0.35)',
                    textDecoration: 'none',
                    transition: 'background 0.2s, border-color 0.2s',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.35)'; }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '0.45rem 1.2rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#fff',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #e23744, #ff7e8b)',
                    textDecoration: 'none',
                    boxShadow: '0 0 16px rgba(226,55,68,0.45)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(226,55,68,0.7)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(226,55,68,0.45)'; e.currentTarget.style.transform = ''; }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-surface-dark-3 cursor-pointer"
            >
              {isMobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-primary-100 dark:border-glass-border-dark"
          >
            <div className="px-4 py-3 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const active = isActiveLink(link);
                if (link.isHash) {
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileOpen(false);
                        if (location.pathname !== '/') {
                          navigate('/' + link.path);
                        } else {
                          const element = document.getElementById(link.path.replace('#', ''));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                      className="block px-4 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-primary-50 dark:hover:bg-surface-dark-3 text-content-light-muted dark:text-content-dark-muted cursor-pointer"
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-primary-500/10 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'hover:bg-primary-50 dark:hover:bg-surface-dark-3 text-content-light-muted dark:text-content-dark-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAuthor && (
                <Link
                  to="/create"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium gradient-bg text-white text-center"
                >
                  ✍️ Write a Post
                </Link>
              )}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-semibold border border-primary-200 dark:border-glass-border-dark rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-semibold text-white gradient-bg rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const DropdownItem = ({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.55rem 0.75rem',
      borderRadius: '0.75rem',
      fontSize: '0.825rem',
      fontWeight: 650,
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      color: danger ? '#e23744' : 'var(--text-muted)',
      transition: 'all 0.15s ease',
      textAlign: 'left',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = danger ? 'rgba(226, 55, 68, 0.1)' : 'var(--bg-card-hover)';
      if (!danger) e.currentTarget.style.color = 'var(--text-main)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = danger ? '#e23744' : 'var(--text-muted)';
    }}
  >
    <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', color: danger ? '#e23744' : '#ff7e8b' }}>
      {icon}
    </span>
    <span style={{ flex: 1 }}>{label}</span>
  </button>
);

export default Navbar;
