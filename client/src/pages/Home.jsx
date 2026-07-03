import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiArrowRight, HiSparkles, HiPencilAlt, HiGlobe, HiTag, HiBookmark, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import FeaturedBlogsSection from '../components/home/FeaturedBlogsSection';
import PopularCategoriesSection from '../components/home/PopularCategoriesSection';
import TrendingAuthorsSection from '../components/home/TrendingAuthorsSection';
import LatestBlogsSection from '../components/home/LatestBlogsSection';
import HomeNewsletterSection from '../components/home/HomeNewsletterSection';
import { useAuth } from '../context/AuthContext';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border-main)', padding: '1.5rem 0' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)'
        }}
      >
        {question}
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </button>
      {isOpen && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
};

const GuestLandingPage = () => {
  return (
    <div style={{ paddingBottom: '5rem', width: '100%' }}>
      {/* 1. Features Grid */}
      <section id="features" style={{ padding: '5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Everything You Need to <span style={{ color: '#e23744' }}>Create & Share</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '600px', margin: '0 auto' }}>
            A powerful, clean blogging platform designed specifically for modern storytellers and creative minds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            {
              icon: <HiPencilAlt style={{ fontSize: '2rem', color: '#e23744' }} />,
              title: "Creative Writing Editor",
              desc: "Write beautiful stories with our distraction-free rich text editor supporting inline formatting and images."
            },
            {
              icon: <HiGlobe style={{ fontSize: '2rem', color: '#ff7e8b' }} />,
              title: "Global Readership",
              desc: "Share your articles instantly with a worldwide network of readers eager to discover fresh perspectives."
            },
            {
              icon: <HiTag style={{ fontSize: '2rem', color: '#e23744' }} />,
              title: "Dynamic Categories",
              desc: "Explore and organize articles across curated categories from software engineering to creative lifestyle."
            },
            {
              icon: <HiBookmark style={{ fontSize: '2rem', color: '#ff7e8b' }} />,
              title: "Personal Library",
              desc: "Save articles to your custom bookmarks list to read later and keep track of your favorite storytellers."
            }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(226, 55, 68, 0.4)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(226, 55, 68, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-main)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', fontFamily: '"Poppins", sans-serif' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. How it Works */}
      <section id="how-it-works" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              How BlogVerse <span style={{ color: '#e23744' }}>Works</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
              Three simple steps to start your publishing journey today.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', position: 'relative' }}>
            {[
              {
                step: "01",
                title: "Register Your Profile",
                desc: "Create a free account in under 30 seconds. No complex roles - every user has the power to both read and write."
              },
              {
                step: "02",
                title: "Write & Format Post",
                desc: "Use our clean dashboard to pen your thoughts. Upload cover images and style text effortlessly."
              },
              {
                step: "03",
                title: "Share & Connect",
                desc: "Publish your post live. Interact with comments, bookmarks, and expand your community of readers."
              }
            ].map((step, index) => (
              <div key={index} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <span style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: 'rgba(226, 55, 68, 0.12)',
                  position: 'absolute',
                  top: '-1.8rem',
                  left: 0,
                  zIndex: 0
                }}>
                  {step.step}
                </span>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', marginTop: '1rem', fontFamily: '"Poppins", sans-serif' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section id="faq" style={{ padding: '6rem 1.5rem 4rem', maxWidth: '800px', margin: '0 auto', borderBottom: '1px solid var(--border-main)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Frequently Asked <span style={{ color: '#e23744' }}>Questions</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
            Have questions? Here are the most common things people ask about BlogVerse.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            {
              q: "Is BlogVerse completely free?",
              a: "Yes! BlogVerse is completely free to use. You can read, write, comment, and bookmark posts without any cost."
            },
            {
              q: "Who can write blogs on BlogVerse?",
              a: "Anyone who creates an account! We do not restrict writing permissions; every registered user can create drafts, publish posts, and upload cover images."
            },
            {
              q: "Can I use images in my blog post?",
              a: "Absolutely! You can choose a stunning cover image for your post card thumbnail and insert inline images within your post content."
            },
            {
              q: "How does the search and category system work?",
              a: "Once logged in, you will have access to a clean Search page and Category filters where you can filter posts by technology, design, travel, and more."
            }
          ].map((item, index) => (
            <FAQItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* 4. CTA */}
      <section style={{ padding: '6rem 1.5rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'radial-gradient(circle at top right, rgba(226,55,68,0.1) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(255,126,139,0.08) 0%, transparent 60%), var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '2rem',
          padding: '4rem 2rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h2 style={{ fontFamily: '"Poppins", sans-serif', fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Ready to Begin Your Story? ✍️
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Join thousands of writers who share their knowledge, ideas, and creative thoughts on BlogVerse.
          </p>
          <Link to="/register">
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.9rem 2.2rem', borderRadius: '1rem',
              background: '#e23744',
              color: '#fff', fontWeight: 700, fontSize: '1.05rem',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(226,55,68,0.4)',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(226,55,68,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(226,55,68,0.4)'; }}
            >
              Get Started for Free <HiArrowRight />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div style={{ width: '100%' }}>

      {/* ════════════════════════════════════════
          HERO SECTION (LOCKED - NO CHANGES)
      ════════════════════════════════════════ */}
      <section
        style={{
          width: '100%',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-main)',
        }}
      >
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div className="animate-blob" style={{
            position: 'absolute', top: '10%', left: '5%',
            width: 'clamp(200px, 30vw, 420px)', height: 'clamp(200px, 30vw, 420px)',
            background: 'radial-gradient(circle, rgba(226,55,68,0.25) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)',
          }} />
          <div className="animate-blob animation-delay-2000" style={{
            position: 'absolute', bottom: '10%', right: '5%',
            width: 'clamp(240px, 35vw, 480px)', height: 'clamp(240px, 35vw, 480px)',
            background: 'radial-gradient(circle, rgba(255,126,139,0.2) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)',
          }} />
          <div className="animate-blob animation-delay-4000" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 'clamp(180px, 28vw, 380px)', height: 'clamp(180px, 28vw, 380px)',
            background: 'radial-gradient(circle, rgba(255,159,67,0.12) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)',
          }} />
        </div>

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(5rem, 12vh, 9rem) 1.5rem clamp(4rem, 8vh, 7rem)',
          textAlign: 'center',
        }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 1.1rem', borderRadius: '999px',
              background: 'rgba(226,55,68,0.15)', border: '1px solid rgba(226,55,68,0.35)',
              color: 'var(--color-primary-500)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em',
            }}>
              <HiSparkles style={{ color: 'var(--color-primary-500)' }} /> The Future of Blogging
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65 }}
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: '1.25rem',
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
            }}
          >
            Where Ideas{' '}
            <span style={{ color: '#e23744' }}>Come Alive</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            Write. Share. Inspire.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'var(--text-muted)',
              maxWidth: '560px',
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            Discover stories, thinking, and expertise from writers on any topic.
            Join our community and share your unique perspective with the world.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ maxWidth: '520px', margin: '0 auto 1.75rem' }}
          >
            <Link
              to="/search"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1.25rem', borderRadius: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                textDecoration: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-main)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
            >
              <HiSearch style={{ color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }} />
              <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'left' }}>
                Search blogs, topics, authors...
              </span>
              <span style={{
                display: 'none',
                padding: '0.2rem 0.5rem', borderRadius: '0.4rem',
                background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                fontSize: '0.75rem', fontWeight: 600,
                flexShrink: 0,
              }} className="sm-show">
                ⌘K
              </span>
            </Link>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}
          >
            <Link to="/blogs">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.75rem', borderRadius: '0.875rem',
                background: '#e23744',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(226,55,68,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                fontFamily: 'inherit',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(226,55,68,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(226,55,68,0.35)'; }}
              >
                Explore Blogs <HiArrowRight />
              </button>
            </Link>
            <Link to={isAuthenticated ? "/create" : "/register"}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.75rem', borderRadius: '0.875rem',
                background: 'transparent', color: 'var(--color-primary-500)', fontWeight: 600,
                fontSize: '0.95rem', cursor: 'pointer',
                border: '1px solid var(--color-primary-500)',
                transition: 'border-color 0.15s, background 0.15s',
                fontFamily: 'inherit',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-50)'; e.currentTarget.style.borderColor = 'var(--color-primary-600)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-primary-500)'; }}
              >
                Start Writing
              </button>
            </Link>
          </motion.div>
          
          {/* Premium Editor Mockup for Guest Users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              style={{
                width: '100%',
                maxWidth: '780px',
                margin: '3.5rem auto 0',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                boxShadow: 'var(--shadow), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                textAlign: 'left'
              }}
            >
              {/* Window Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-main)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>create-post.md • Draft Saved</span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', background: 'rgba(226,55,68,0.1)', color: '#e23744', fontWeight: 600 }}>Tiptap Editor</span>
              </div>

              {/* Editor Toolbar Mock */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border-main)' }}>
                {['H1', 'H2', 'B', 'I', 'Code', 'Link', 'Image', 'Bullet List'].map((tool, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', borderRadius: '0.35rem', background: tool === 'B' || tool === 'Image' ? 'rgba(226,55,68,0.12)' : 'transparent', color: tool === 'B' || tool === 'Image' ? '#e23744' : 'var(--text-muted)', fontWeight: 600, border: '1px solid transparent' }}>
                    {tool}
                  </span>
                ))}
              </div>

              {/* Editor Content Area Mock */}
              <div style={{ padding: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', background: 'rgba(226,55,68,0.1)', color: '#e23744', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
                  ⚡ Tech & Innovation
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', fontFamily: '"Poppins", sans-serif' }}>
                  Building a modern blogging platform with real-time text formatting
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                  Start writing your story here... Use the toolbar above to format headings, list items, or add inline code blocks. You can also upload a cover photo to make your post stand out on the home feed.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {isAuthenticated ? (
        <>
          {/* ════════════════════════════════════════
              NEW PREMIUM HOMEPAGE SECTIONS
          ════════════════════════════════════════ */}
          <FeaturedBlogsSection />
          
          <PopularCategoriesSection />
          
          <TrendingAuthorsSection />
          
          <LatestBlogsSection />
          
          <HomeNewsletterSection />
        </>
      ) : (
        <GuestLandingPage />
      )}

    </div>
  );
};

export default Home;
