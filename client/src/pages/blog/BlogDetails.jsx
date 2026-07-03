import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiBookmark, HiShare, HiClock, HiEye, HiCalendar, HiLink } from 'react-icons/hi';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import BlogCard from '../../components/blog/BlogCard';
import CommentSection from '../../components/blog/CommentSection';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { useAuth } from '../../context/AuthContext';
import { blogService, bookmarkService } from '../../services/blogService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { MOCK_BLOGS_DETAILS } from '../../utils/mockBlogContents';
import Footer from '../../components/common/Footer'; // Import Footer to show at bottom of scrollable area on desktop

const BlogDetails = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const progress = useReadingProgress();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Responsive state for split screen
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  // Hide the global MainLayout footer on desktop split-screen view
  useEffect(() => {
    const globalFooter = document.querySelector('footer');
    if (isDesktop && globalFooter) {
      globalFooter.style.display = 'none';
    } else if (globalFooter) {
      globalFooter.style.display = 'block';
    }
    return () => {
      if (globalFooter) {
        globalFooter.style.display = 'block';
      }
    };
  }, [isDesktop]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data } = await blogService.getBySlug(slug);
      setBlog(data.blog);
      setRelatedBlogs(data.relatedBlogs || []);
      setLikesCount(data.blog.likes?.length || 0);
      setLiked(data.blog.likes?.includes(user?._id));

      // Check bookmark
      if (isAuthenticated) {
        try {
          const bookmarkRes = await bookmarkService.check(data.blog._id);
          setBookmarked(bookmarkRes.data.bookmarked);
        } catch { /* silent */ }
      }
    } catch (err) {
      // Fallback to local mock contents
      const mockBlog = MOCK_BLOGS_DETAILS[slug];
      if (mockBlog) {
        setBlog(mockBlog);
        const likeKey = `mock_like_${mockBlog._id}_${user?._id || 'guest'}`;
        const isLiked = localStorage.getItem(likeKey) === 'true';
        setLiked(isLiked);
        setLikesCount((mockBlog.likesCount || 0) + (isLiked ? 1 : 0));
        
        const localBookmarks = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
        setBookmarked(localBookmarks.includes(mockBlog._id));
        setRelatedBlogs([]);
      } else {
        toast.error('Blog not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    
    // Check if it is a mock blog
    const isMock = blog._id && (blog._id.toString().startsWith('f') || blog._id.toString().startsWith('l'));
    if (isMock) {
      const storageKey = `mock_like_${blog._id}_${user?._id || 'guest'}`;
      const wasLiked = localStorage.getItem(storageKey) === 'true';
      const newLiked = !wasLiked;
      
      localStorage.setItem(storageKey, newLiked ? 'true' : 'false');
      setLiked(newLiked);
      setLikesCount((blog.likesCount || 0) + (newLiked ? 1 : 0));
      return;
    }
    
    try {
      const { data } = await blogService.toggleLike(blog._id);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch { /* silent */ }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    
    // Check if it is a mock blog
    const isMock = blog._id && (blog._id.toString().startsWith('f') || blog._id.toString().startsWith('l'));
    if (isMock) {
      let localBookmarks = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
      const isBookmarkedNow = localBookmarks.includes(blog._id);
      
      let newBookmarked = false;
      if (isBookmarkedNow) {
        localBookmarks = localBookmarks.filter(id => id !== blog._id);
      } else {
        localBookmarks.push(blog._id);
        newBookmarked = true;
      }
      localStorage.setItem(`mock_bookmarks_${user?._id || 'guest'}`, JSON.stringify(localBookmarks));
      setBookmarked(newBookmarked);
      toast.success(newBookmarked ? 'Bookmarked! 📚' : 'Bookmark removed');
      return;
    }
    
    try {
      const { data } = await bookmarkService.toggle(blog._id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked! 📚' : 'Bookmark removed');
    } catch { /* silent */ }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.title;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied! 🔗');
  };

  if (loading) {
    return (
      <div className="bv-container" style={{ maxWidth: '800px', padding: '4rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton variant="image" className="h-64 sm:h-80 rounded-2xl" />
        <Skeleton variant="title" className="h-8 sm:h-10 w-3/4" />
        <Skeleton variant="text" count={5} className="space-y-2" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 1rem' }}>
        <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>😕</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: '"Poppins",sans-serif', marginBottom: '1rem' }}>Blog Not Found</h2>
        <Link to="/blogs" style={{ textDecoration: 'none' }}>
          <motion.span whileHover={{ x: -5 }} style={{ color: '#ff7e8b', fontWeight: 600, cursor: 'pointer' }}>
            ← Back to blogs
          </motion.span>
        </Link>
      </div>
    );
  }

  // DESKTOP LAYOUT (SPLIT SCREEN)
  if (isDesktop) {
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 5.5rem)', display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Reading Progress Bar (Anchored at very top of outlet area) */}
        <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})`, top: '5.5rem' }} />

        {/* Left Side: Fixed Cover Image (45% Width) */}
        <div style={{ 
          flex: '0 0 45%', 
          height: '100%', 
          position: 'relative', 
          overflow: 'hidden', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0512',
          padding: '1.75rem'
        }}>
          {/* Blurred background glow */}
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(32px) brightness(0.22) saturate(1.4)',
                opacity: 0.9,
                zIndex: 0,
              }}
            />
          )}

          {/* Foreground Rectangular Image (Breadth > Length) */}
          {blog.coverImage ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={blog.coverImage}
              alt={blog.title}
              style={{
                width: '100%',
                aspectRatio: '16/10',
                objectFit: 'cover',
                borderRadius: '1.25rem',
                border: '1px solid var(--border-main)',
                boxShadow: 'var(--shadow)',
                zIndex: 1,
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/10', 
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-main) 100%)', 
              borderRadius: '1.25rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid var(--border-main)',
              zIndex: 1
            }}>
              <span style={{ fontSize: '3rem' }}>📝</span>
            </div>
          )}
          
          {/* Subtle separator shadow line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '10px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))', zIndex: 2, pointerEvents: 'none' }} />
        </div>

        {/* Right Side: Scrollable Details Panel (55% Width) */}
        <div style={{ flex: '0 0 55%', height: '100%', overflowY: 'auto', background: 'var(--bg-main)', borderLeft: '1px solid var(--border-main)' }}>
          <div style={{ padding: '3.5rem 3rem 6rem', maxWidth: '720px', margin: '0 auto' }}>
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.category && (
                <Badge color="red">{blog.category.icon} {blog.category.name}</Badge>
              )}
              {blog.tags?.map((tag) => (
                <Badge key={tag} color="gray">#{tag}</Badge>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-main)',
              marginBottom: '1rem',
            }}>
              {blog.title}
            </h1>

            {/* Subtitle */}
            {blog.subtitle && (
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {blog.subtitle}
              </p>
            )}

            {/* Author & Meta Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <Link to={`/profile/${blog.author?._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }} className="group">
                <img
                  src={blog.author?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${blog.author?.name}`}
                  alt={blog.author?.name}
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid rgba(226, 55, 68, 0.4)',
                  }}
                />
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }} className="group-hover:text-primary-600 transition-colors">
                    {blog.author?.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {blog.author?.bio || 'Creator'}
                  </p>
                </div>
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 'auto' }}>
                <span>{formatDate(blog.createdAt)}</span>
                <span>•</span>
                <span>{blog.readingTime} min read</span>
                <span>•</span>
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Main HTML Content */}
            <div
              className="blog-content text-lg mb-10"
              style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.95' }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Actions Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 0',
              borderTop: '1px solid var(--border-main)',
              borderBottom: '1px solid var(--border-main)',
              marginBottom: '2.5rem',
            }}>
              <div className="flex items-center gap-3">
                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 1.25 }}
                  onClick={handleLike}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1rem', borderRadius: '0.75rem',
                    cursor: 'pointer', border: 'none',
                    background: liked ? 'rgba(226, 55, 68, 0.12)' : 'var(--bg-card-hover)',
                    color: liked ? '#e23744' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  <HiHeart style={{ fontSize: '1.25rem', fill: liked ? '#e23744' : 'none' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{likesCount}</span>
                </motion.button>

                {/* Bookmark Button */}
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={handleBookmark}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1rem', borderRadius: '0.75rem',
                    cursor: 'pointer', border: 'none',
                    background: bookmarked ? 'rgba(255, 126, 139, 0.12)' : 'var(--bg-card-hover)',
                    color: bookmarked ? '#ff7e8b' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  <HiBookmark style={{ fontSize: '1.25rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{bookmarked ? 'Saved' : 'Save'}</span>
                </motion.button>
              </div>

              {/* Share Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button onClick={() => handleShare('twitter')} style={{ padding: '0.45rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} className="hover:text-blue-400">
                  <FaTwitter style={{ fontSize: '1.1rem' }} />
                </button>
                <button onClick={() => handleShare('facebook')} style={{ padding: '0.45rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} className="hover:text-blue-600">
                  <FaFacebook style={{ fontSize: '1.1rem' }} />
                </button>
                <button onClick={() => handleShare('linkedin')} style={{ padding: '0.45rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} className="hover:text-blue-700">
                  <FaLinkedin style={{ fontSize: '1.1rem' }} />
                </button>
                <button onClick={copyLink} style={{ padding: '0.45rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} className="hover:text-[#ff7e8b]">
                  <HiLink style={{ fontSize: '1.15rem' }} />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection blogId={blog._id} />
          </div>

          {/* Sub-footer inside scroll area */}
          <Footer />
        </div>
      </div>
    );
  }

  // MOBILE/TABLET LAYOUT (STANDARD SCROLL)
  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <article className="bv-container" style={{ maxWidth: '800px', padding: '2rem 1.25rem' }}>
        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10"
          >
            <img src={blog.coverImage} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover" />
          </motion.div>
        )}

        {/* Category & Tags */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-4">
          {blog.category && (
            <Badge color="red">{blog.category.icon} {blog.category.name}</Badge>
          )}
          {blog.tags?.map((tag) => (
            <Badge key={tag} color="gray">#{tag}</Badge>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins leading-tight mb-4"
        >
          {blog.title}
        </motion.h1>

        {/* Subtitle */}
        {blog.subtitle && (
          <p className="text-lg text-content-light-muted dark:text-content-dark-muted mb-6">
            {blog.subtitle}
          </p>
        )}

        {/* Author & Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-primary-100 dark:border-glass-border-dark"
        >
          <Link to={`/profile/${blog.author?._id}`} className="flex items-center gap-3 group">
            <img
              src={blog.author?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${blog.author?.name}`}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full border-2 border-primary-200"
            />
            <div>
              <p className="font-semibold group-hover:text-primary-600 transition-colors">{blog.author?.name}</p>
              <p className="text-xs text-content-light-muted dark:text-content-dark-muted">{blog.author?.bio || 'Writer'}</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-4 ml-auto text-sm text-content-light-muted dark:text-content-dark-muted">
            <span className="flex items-center gap-1"><HiCalendar /> {formatDate(blog.createdAt)}</span>
            <span className="flex items-center gap-1"><HiClock /> {blog.readingTime} min read</span>
            <span className="flex items-center gap-1"><HiEye /> {blog.views} views</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="blog-content text-lg mb-10"
          style={{ lineHeight: '1.95' }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-b border-primary-100 dark:border-glass-border-dark mb-10">
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                liked
                  ? 'bg-pink-50 dark:bg-pink-900/20 text-accent-pink'
                  : 'hover:bg-pink-50 dark:hover:bg-pink-900/20 text-content-light-muted'
              }`}
            >
              <HiHeart className={`text-xl ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-semibold">{likesCount}</span>
            </motion.button>

            {/* Bookmark */}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                bookmarked
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-content-light-muted'
              }`}
            >
              <HiBookmark className="text-xl" />
              <span className="text-sm font-semibold">{bookmarked ? 'Saved' : 'Save'}</span>
            </motion.button>
          </div>

          {/* Share */}
          <div className="flex items-center gap-2">
            <button onClick={() => handleShare('twitter')} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-content-light-muted hover:text-blue-500 cursor-pointer">
              <FaTwitter className="text-lg" />
            </button>
            <button onClick={() => handleShare('facebook')} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-content-light-muted hover:text-blue-600 cursor-pointer">
              <FaFacebook className="text-lg" />
            </button>
            <button onClick={() => handleShare('linkedin')} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-content-light-muted hover:text-blue-700 cursor-pointer">
              <FaLinkedin className="text-lg" />
            </button>
            <button onClick={copyLink} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-content-light-muted hover:text-primary-600 cursor-pointer">
              <HiLink className="text-lg" />
            </button>
          </div>
        </div>

        {/* Comments */}
        <CommentSection blogId={blog._id} />

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold font-poppins mb-6">Related Posts 📖</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rb, i) => (
                <BlogCard key={rb._id} blog={rb} index={i} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default BlogDetails;
