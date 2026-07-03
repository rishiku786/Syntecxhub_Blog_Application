import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUserGroup } from 'react-icons/hi';

const AUTHORS_DATA = [
  {
    id: 'a1',
    name: 'Dr. Sarah Jenkins',
    role: 'AI Researcher & Tech Writer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    blogsCount: 28,
    followersCount: '4.8K',
    bio: 'Deep learning specialist exploring how artificial intelligence is changing the texture of human society.',
  },
  {
    id: 'a2',
    name: 'Alex Rivera',
    role: 'Lead UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    blogsCount: 19,
    followersCount: '3.2K',
    bio: 'Crafting premium interactive interfaces. Writing guides to help designers learn best frontend methodologies.',
  },
  {
    id: 'a3',
    name: 'Elena Rostova',
    role: 'Outdoor Journalist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop',
    blogsCount: 34,
    followersCount: '6.1K',
    bio: 'Adventurer traveling the remote paths of the Earth. Sharing survival wisdom and pristine scenery guides.',
  },
  {
    id: 'a4',
    name: 'David Chen',
    role: 'SaaS Startup Consultant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    blogsCount: 22,
    followersCount: '2.9K',
    bio: 'Helping startups build products that generate revenue. Writing deep-dives on SaaS operations and finance.',
  }
];

const AuthorCard = ({ author }) => {
  const [following, setFollowing] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      style={{
        padding: '1.5rem',
        borderRadius: '1.25rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-main)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(226, 55, 68, 0.3)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(226, 55, 68, 0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-main)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* Avatar with Glow Border */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <img
          src={author.avatar}
          alt={author.name}
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2.5px solid #e23744',
            boxShadow: '0 4px 16px rgba(226, 55, 68, 0.25)',
          }}
        />
        <div style={{
          position: 'absolute', bottom: '2px', right: '2px',
          width: '1rem', height: '1rem', borderRadius: '50%',
          background: '#22c55e', border: '2px solid var(--bg-card)',
          boxShadow: '0 0 8px rgba(34,197,94,0.5)'
        }} />
      </div>

      {/* Name and Role */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: '"Poppins", sans-serif', marginBottom: '0.15rem' }}>
        {author.name}
      </h3>
      <span style={{ fontSize: '0.72rem', color: '#ff7e8b', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        {author.role}
      </span>

      {/* Bio */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1.25rem', height: '3.3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {author.bio}
      </p>

      {/* Stats row */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', background: 'var(--bg-main)', padding: '0.5rem 0.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-main)', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{author.blogsCount}</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Blogs</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border-main)' }} />
        <div>
          <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{author.followersCount}</span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Followers</span>
        </div>
      </div>

      {/* Follow Button */}
      <button
        onClick={() => setFollowing(!following)}
        style={{
          width: '100%',
          padding: '0.55rem',
          borderRadius: '0.75rem',
          background: following ? 'var(--bg-main)' : 'linear-gradient(135deg, #e23744, #ff7e8b)',
          border: following ? '1px solid var(--border-main)' : 'none',
          color: following ? 'var(--text-main)' : '#fff',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: following ? 'none' : '0 4px 12px rgba(226, 55, 68, 0.25)',
        }}
        onMouseEnter={e => {
          if (!following) {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 55, 68, 0.4)';
          } else {
            e.currentTarget.style.background = 'var(--bg-card-hover)';
          }
        }}
        onMouseLeave={e => {
          if (!following) {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 55, 68, 0.25)';
          } else {
            e.currentTarget.style.background = 'var(--bg-main)';
          }
        }}
      >
        {following ? 'Following ✓' : 'Follow Creator'}
      </button>
    </motion.div>
  );
};

const TrendingAuthorsSection = () => {
  return (
    <section style={{ width: '100%', padding: '5rem 0', background: 'var(--bg-main)' }}>
      <div style={{ width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontFamily: '"Poppins", sans-serif', fontWeight: 800, color: 'var(--text-main)' }}>
            Trending Authors
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '1.5rem',
        }}>
          {AUTHORS_DATA.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingAuthorsSection;
export { AUTHORS_DATA };
