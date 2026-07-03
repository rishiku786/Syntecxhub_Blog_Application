import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiMail } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { newsletterService } from '../../services/blogService';
import toast from 'react-hot-toast';

const MUT = '#6b7280'; // muted text color
const LINK_COLOR = '#94a3b8';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const { data } = await newsletterService.subscribe(email);
      toast.success(data.message || 'Subscribed! 🎉');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const footerLinks = {
    Product: [
      { label: 'Home', path: '/' },
      { label: 'Blogs', path: '/blogs' },
      { label: 'Categories', path: '/blogs?view=categories' },
      { label: 'Search', path: '/search' },
    ],
    Company: [
      { label: 'About', path: '#' },
      { label: 'Contact', path: '#' },
      { label: 'Careers', path: '#' },
      { label: 'Press', path: '#' },
    ],
    Legal: [
      { label: 'Privacy', path: '#' },
      { label: 'Terms', path: '#' },
      { label: 'Cookie Policy', path: '#' },
    ],
  };

  return (
    <footer style={{ background: '#0a0614', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem 2rem' }}>

        {/* Grid: brand + 3 link columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}>
              <div className="gradient-bg" style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>B</span>
              </div>
              <span className="brand-text" style={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
                BlogVerse
              </span>
            </Link>

            <p style={{ fontSize: '0.85rem', color: '#8b95a5', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '240px' }}>
              A premium blogging platform where ideas come alive. Write, share, and discover stories that matter.
            </p>

            {/* Quick email subscribe */}
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', maxWidth: '260px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <HiMail style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: MUT, flexShrink: 0 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  style={{
                    width: '100%', paddingLeft: '2.2rem', paddingRight: '0.75rem', paddingTop: '0.55rem', paddingBottom: '0.55rem',
                    borderRadius: '0.65rem', border: '1px solid var(--border-main)',
                    background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.82rem', outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                type="submit" disabled={subscribing}
                className="gradient-bg"
                style={{
                  flexShrink: 0, padding: '0.55rem 0.85rem', borderRadius: '0.65rem',
                  color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                  border: 'none', cursor: 'pointer', opacity: subscribing ? 0.6 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {subscribing ? '...' : 'Go'}
              </motion.button>
            </form>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: '"Poppins",sans-serif', fontWeight: 700,
                fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#e2e8f0', marginBottom: '1rem',
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      style={{ fontSize: '0.85rem', color: LINK_COLOR, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ff7e8b'}
                      onMouseLeave={e => e.currentTarget.style.color = LINK_COLOR}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.82rem', color: MUT, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Made with <HiHeart style={{ color: '#ec4899', flexShrink: 0 }} /> by BlogVerse &copy; {new Date().getFullYear()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ scale: 1.2, y: -2 }}
                style={{ color: MUT, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff7e8b'}
                onMouseLeave={e => e.currentTarget.style.color = MUT}
              >
                <Icon style={{ fontSize: '1.15rem' }} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
