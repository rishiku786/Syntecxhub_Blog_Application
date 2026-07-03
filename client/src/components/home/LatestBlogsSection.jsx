import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import PremiumBlogCard from '../blog/PremiumBlogCard';

const LATEST_MOCK_DATA = [
  {
    _id: 'l1',
    title: 'The Art of Writing Clean Code: Best Practices for Junior Developers',
    slug: 'art-of-writing-clean-code-best-practices',
    summary: 'Clean code is not just written; it is engineered. Discover core refactoring strategies, variable naming standards, and documentation styles.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Technology' },
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-28T09:15:00Z',
    readingTime: '5 min',
    likesCount: 142,
    commentsCount: 18
  },
  {
    _id: 'l2',
    title: 'Building a Productive Morning Routine: Lessons from Top Creatives',
    slug: 'productive-morning-routine-creative-habits',
    summary: 'How you start your day determines its outcome. We analyze the daily routines of successful artists, writers, and software designers.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Lifestyle' },
    author: {
      name: 'Clara Oswald',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-27T08:00:00Z',
    readingTime: '4 min',
    likesCount: 98,
    commentsCount: 12
  },
  {
    _id: 'l3',
    title: 'An In-Depth Introduction to CSS Container Queries and Resizing layouts',
    slug: 'introduction-to-css-container-queries',
    summary: 'Container queries are here. Learn how to style components based on their parent dimensions rather than the viewport grid.',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Design' },
    author: {
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-26T14:50:00Z',
    readingTime: '7 min',
    likesCount: 115,
    commentsCount: 16
  }
];

const LatestBlogsSection = () => {
  return (
    <section style={{ width: '100%', padding: '5rem 0', background: 'var(--bg-card)' }}>
      <div style={{ width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontFamily: '"Poppins", sans-serif', fontWeight: 800, color: 'var(--text-main)' }}>
              Latest Posts
            </h2>
          </div>
          <Link
            to="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#ff7e8b',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-500)'}
            onMouseLeave={e => e.currentTarget.style.color = '#ff7e8b'}
          >
            View All Articles <HiArrowRight />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '2rem',
          }}
        >
          {LATEST_MOCK_DATA.map((blog) => (
            <div key={blog._id}>
              <PremiumBlogCard blog={blog} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
export { LATEST_MOCK_DATA };
