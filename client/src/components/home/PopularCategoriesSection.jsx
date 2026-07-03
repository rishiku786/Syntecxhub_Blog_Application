import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';

const CATEGORIES_DATA = [
  { id: '1', name: 'Technology', icon: '💻', count: 142, desc: 'AI, web dev, and future tech trends.', color: '#e23744' },
  { id: '2', name: 'Design', icon: '🎨', count: 86, desc: 'UI/UX guidelines, animations, and typography.', color: '#ff7e8b' },
  { id: '3', name: 'Business', icon: '📈', count: 94, desc: 'SaaS solutions, finance, and startups growth.', color: '#ff9f43' },
  { id: '4', name: 'Travel', icon: '✈️', count: 64, desc: 'Wild trails, backpack guides, and explorations.', color: '#e23744' },
  { id: '5', name: 'Health', icon: '🧘', count: 73, desc: 'Wellness, psychology of focus, and mindfulness.', color: '#ff7e8b' },
  { id: '6', name: 'Lifestyle', icon: '☕', count: 110, desc: 'Productive habits, creative writing, and routines.', color: '#ff9f43' },
];

const PopularCategoriesSection = () => {
  return (
    <section style={{ width: '100%', padding: '5rem 0', background: 'var(--bg-card)' }}>
      <div style={{ width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '2.5rem', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontFamily: '"Poppins", sans-serif', fontWeight: 800, color: 'var(--text-main)' }}>
            Popular Categories
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Browse through top categories and discover content customized for your interests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {CATEGORIES_DATA.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/blogs?category=${cat.name}`}
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  borderRadius: '1.25rem',
                  background: 'var(--bg-main)',

                  border: '1px solid var(--border-main)',
                  textDecoration: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.boxShadow = `0 10px 30px ${cat.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-main)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Corner Glow Overlay */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '90px', height: '90px',
                  background: `radial-gradient(circle, ${cat.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>
                  {cat.icon}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    fontFamily: '"Poppins", sans-serif',
                  }}>
                    {cat.name}
                  </h3>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 750,
                    color: cat.color,
                    background: `${cat.color}12`,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                  }}>
                    {cat.count} articles
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {cat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
export { CATEGORIES_DATA };
