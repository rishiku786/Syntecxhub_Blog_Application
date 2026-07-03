import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart, HiOutlineChat, HiOutlineBookmark, HiBookmark } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { blogService, bookmarkService } from '../../services/blogService';
import toast from 'react-hot-toast';

const PremiumBlogCard = ({ blog, onBookmarkToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || blog.likes?.length || 0);

  const isMock = blog._id && (blog._id.toString().startsWith('f') || blog._id.toString().startsWith('l'));

  useEffect(() => {
    if (isMock) {
      const likeKey = `mock_like_${blog._id}_${user?._id || 'guest'}`;
      const isLiked = localStorage.getItem(likeKey) === 'true';
      setLiked(isLiked);
      setLikesCount((blog.likesCount || 0) + (isLiked ? 1 : 0));
      
      const localBookmarks = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
      setBookmarked(localBookmarks.includes(blog._id));
    } else {
      setLiked(blog.likes?.includes(user?._id) || false);
      setLikesCount(blog.likes?.length || 0);
      
      // Bookmark check for DB blogs
      if (isAuthenticated) {
        bookmarkService.check(blog._id)
          .then(res => setBookmarked(res.data.bookmarked))
          .catch(() => {});
      }
    }
  }, [blog._id, user?._id, isMock, isAuthenticated]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login first');

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

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login first');

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
      if (onBookmarkToggle) onBookmarkToggle(blog._id, newBookmarked);
      return;
    }

    try {
      const { data } = await bookmarkService.toggle(blog._id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked! 📚' : 'Bookmark removed');
      if (onBookmarkToggle) onBookmarkToggle(blog._id, data.bookmarked);
    } catch { /* silent */ }
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        background: 'var(--bg-card)',

        border: '1px solid var(--border-main)',
        boxShadow: 'var(--shadow)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(226, 55, 68, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(226, 55, 68, 0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-main)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* 16:9 Image Wrapper */}
      <Link to={`/blog/${blog.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=720&auto=format&fit=crop'}
          alt={blog.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Category Badge */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
          <span style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(226, 55, 68, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(226, 55, 68, 0.25)',
          }}>
            {blog.category?.name || 'Article'}
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            fontFamily: '"Poppins", sans-serif',
            lineHeight: 1.35,
            marginBottom: '0.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '2.7rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff7e8b'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-main)'}
          >
            {blog.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '2.55rem',
        }}>
          {blog.summary || blog.content?.replace(/<[^>]*>/g, '') || 'Discover this insightful article containing amazing thoughts and stories...'}
        </p>

        {/* Author Bio Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderTop: '1px solid var(--border-main)', paddingTop: '1rem' }}>
          <img
            src={blog.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'}
            alt={blog.author?.name}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(226, 55, 68, 0.4)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {blog.author?.name || 'Anonymity Writer'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'June 29, 2026'}</span>
              <span>•</span>
              <span>{blog.readingTime || '5 min'} read</span>
            </div>
          </div>
        </div>

        {/* Footer Interaction Stats */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifycontent: 'space-between', borderTop: '1px solid var(--border-main)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            {/* Likes */}
            <button
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: liked ? '#e23744' : 'var(--text-muted)', fontSize: '0.78rem',
                padding: 0,
                transition: 'color 0.2s',
              }}
            >
              {liked ? <HiHeart style={{ fontSize: '1.1rem' }} /> : <HiOutlineHeart style={{ fontSize: '1.1rem' }} />}
              <span>{likesCount}</span>
            </button>

            {/* Comments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <HiOutlineChat style={{ fontSize: '1.05rem' }} />
              <span>{blog.commentsCount || 0}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              style={{
                display: 'flex', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                color: bookmarked ? '#ff7e8b' : 'var(--text-muted)',
                padding: 0,
                transition: 'color 0.2s',
              }}
            >
              {bookmarked ? <HiBookmark style={{ fontSize: '1.05rem' }} /> : <HiOutlineBookmark style={{ fontSize: '1.05rem' }} />}
            </button>

            {/* Read More Link */}
            <Link
              to={`/blog/${blog.slug}`}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ff7e8b',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-500)'}
              onMouseLeave={e => e.currentTarget.style.color = '#ff7e8b'}
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumBlogCard;
