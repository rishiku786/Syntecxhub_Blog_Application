import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';
import PremiumBlogCard from '../blog/PremiumBlogCard';

const FEATURED_MOCK_DATA = [
  {
    _id: 'f1',
    title: 'The Future of AI: Building Beyond LLMs and Generative Models',
    slug: 'future-of-ai-beyond-llms',
    summary: 'Explore what lies ahead in artificial intelligence, from autonomous agents to neuromorphic computing, and how they will shape our lives.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Technology' },
    author: {
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-25T10:00:00Z',
    readingTime: '6 min',
    likesCount: 245,
    commentsCount: 38
  },
  {
    _id: 'f2',
    title: 'Mastering Minimalist UI/UX: Design Principles for Modern Products',
    slug: 'mastering-minimalist-ui-ux-design',
    summary: 'Less is more. Learn the core principles of designing clean, interactive, and visually stunning digital products that users love.',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Design' },
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-24T14:30:00Z',
    readingTime: '5 min',
    likesCount: 189,
    commentsCount: 24
  },
  {
    _id: 'f3',
    title: 'Hidden Gems: A Journey Through the Untouched Trails of Patagonia',
    slug: 'untouched-trails-of-patagonia-travel',
    summary: 'An extensive travel guide detailing the most scenic, hidden hiking routes and survival tips for adventurers exploring South America.',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Travel' },
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-22T08:15:00Z',
    readingTime: '8 min',
    likesCount: 312,
    commentsCount: 42
  },
  {
    _id: 'f4',
    title: 'How Startups Leverage Micro-SaaS to Generate Sustainable Revenue',
    slug: 'how-startups-leverage-micro-saas',
    summary: 'A deep dive into how niche software-as-a-service products scale and build profitable, low-overhead recurring revenue models.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Business' },
    author: {
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-20T11:45:00Z',
    readingTime: '7 min',
    likesCount: 156,
    commentsCount: 19
  },
  {
    _id: 'f5',
    title: 'The Science of Flow State: Optimizing Mind and Body for High Output',
    slug: 'science-of-flow-state-optimization',
    summary: 'Unlock cognitive peak performance. Understand the neurological triggers behind the flow state and how to trigger it daily.',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Health' },
    author: {
      name: 'Clara Oswald',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-19T09:00:00Z',
    readingTime: '4 min',
    likesCount: 228,
    commentsCount: 29
  },
  {
    _id: 'f6',
    title: 'Demystifying Modern Typography: Selecting Fonts that Speak to Users',
    slug: 'demystifying-modern-typography-fonts',
    summary: 'Every typeface has a voice. Learn how to combine fonts, sizes, and layout weights to create readable and emotionally engaging layouts.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=720&auto=format&fit=crop',
    category: { name: 'Lifestyle' },
    author: {
      name: 'Marcus Aurelius',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop'
    },
    createdAt: '2026-06-18T16:20:00Z',
    readingTime: '6 min',
    likesCount: 194,
    commentsCount: 31
  }
];

const FeaturedBlogsSection = () => {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <HiStar style={{ color: '#e23744', fontSize: '1.3rem' }} />
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontFamily: '"Poppins", sans-serif', fontWeight: 800, color: 'var(--text-main)' }}>
              Featured Blogs
            </h2>
          </div>
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
          {FEATURED_MOCK_DATA.map((blog) => (
            <div key={blog._id}>
              <PremiumBlogCard blog={blog} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogsSection;
export { FEATURED_MOCK_DATA };
