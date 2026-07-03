import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBookmark, HiTrash } from 'react-icons/hi';
import PremiumBlogCard from '../../components/blog/PremiumBlogCard';
import { BlogCardSkeleton } from '../../components/ui/Skeleton';
import { bookmarkService } from '../../services/blogService';
import toast from 'react-hot-toast';
import { MOCK_BLOGS_DETAILS } from '../../utils/mockBlogContents';
import { useAuth } from '../../context/AuthContext';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await bookmarkService.getAll();
      const dbBookmarks = data.bookmarks || [];

      // Get mock bookmarks from localStorage
      const mockIds = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
      const localBookmarks = mockIds.map(id => {
        const foundKey = Object.keys(MOCK_BLOGS_DETAILS).find(key => MOCK_BLOGS_DETAILS[key]._id === id);
        if (foundKey) {
          const mockBlog = MOCK_BLOGS_DETAILS[foundKey];
          return {
            _id: `bookmark_${id}`,
            blog: {
              ...mockBlog,
              slug: foundKey
            }
          };
        }
        return null;
      }).filter(Boolean);

      setBookmarks([...dbBookmarks, ...localBookmarks]);
    } catch {
      // Local fallback
      const mockIds = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
      const localBookmarks = mockIds.map(id => {
        const foundKey = Object.keys(MOCK_BLOGS_DETAILS).find(key => MOCK_BLOGS_DETAILS[key]._id === id);
        if (foundKey) {
          const mockBlog = MOCK_BLOGS_DETAILS[foundKey];
          return {
            _id: `bookmark_${id}`,
            blog: {
              ...mockBlog,
              slug: foundKey
            }
          };
        }
        return null;
      }).filter(Boolean);
      setBookmarks(localBookmarks);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (blogId, skipToast = false) => {
    if (blogId && blogId.toString().startsWith('f')) {
      let localBookmarks = JSON.parse(localStorage.getItem(`mock_bookmarks_${user?._id || 'guest'}`)) || [];
      localBookmarks = localBookmarks.filter(id => id !== blogId);
      localStorage.setItem(`mock_bookmarks_${user?._id || 'guest'}`, JSON.stringify(localBookmarks));
      setBookmarks((prev) => prev.filter((b) => b.blog._id !== blogId));
      if (!skipToast) toast.success('Bookmark removed');
      return;
    }

    try {
      await bookmarkService.toggle(blogId);
      setBookmarks((prev) => prev.filter((b) => b.blog._id !== blogId));
      if (!skipToast) toast.success('Bookmark removed');
    } catch { 
      if (!skipToast) toast.error('Failed to remove'); 
    }
  };

  return (
    <div className="bv-container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '1.4rem' }}>
          <HiBookmark className="text-2xl sm:text-3xl text-primary-500 flex-shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins">My Bookmarks</h1>
            <p className="text-content-light-muted dark:text-content-dark-muted text-sm">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16 sm:py-20 flex flex-col items-center">
            <span className="text-5xl sm:text-6xl mb-4">📚</span>
            <h3 className="text-lg sm:text-xl font-bold font-poppins mb-2">No bookmarks yet</h3>
            <p className="text-content-light-muted dark:text-content-dark-muted text-sm sm:text-base">
              Save articles you love to read them later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark, i) => (
              <div key={bookmark._id} className="relative group h-full flex flex-col" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <PremiumBlogCard blog={bookmark.blog} onBookmarkToggle={(id, bookmarked) => { if (!bookmarked) handleRemove(id, true); }} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(bookmark.blog._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg z-10"
                >
                  <HiTrash className="text-sm" />
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Bookmarks;
