import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { newsletterService } from '../../services/blogService';

const HomeNewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e) => {
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

  return (
    <section style={{ width: '100%', padding: '5rem 0', background: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1.5rem',
            background: 'linear-gradient(135deg, #e23744 0%, #ff7e8b 100%)',
            padding: 'clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4.5rem)',
            textAlign: 'center',
            boxShadow: '0 12px 48px rgba(226, 55, 68, 0.25)',
          }}>
            {/* Decorative glows */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.12)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.7rem, 4.5vw, 2.7rem)', marginBottom: '0.75rem', lineHeight: 1.15 }}>
                Stay in the Loop
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2.25rem', fontSize: 'clamp(0.88rem, 2vw, 1.05rem)', maxWidth: '520px', margin: '0 auto 2.25rem', lineHeight: 1.5 }}>
                Get the latest articles, technology guides, and creative writing inspiration delivered to your inbox every week.
              </p>

              <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    flex: '1 1 240px',
                    minWidth: '0',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '0.875rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#0f0a1a',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    fontWeight: 550,
                  }}
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.8rem 1.75rem',
                    borderRadius: '0.875rem',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '2px solid rgba(255, 255, 255, 0.65)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    opacity: subscribing ? 0.65 : 1,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe →'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeNewsletterSection;
