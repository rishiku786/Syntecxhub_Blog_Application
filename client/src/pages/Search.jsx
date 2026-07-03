import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiX } from 'react-icons/hi';
import BlogCard from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/ui/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { blogService } from '../services/blogService';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchBlogs();
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [debouncedQuery]);

  const searchBlogs = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await blogService.getAll({ search: debouncedQuery, limit: 20 });
      setResults(data.blogs || []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bv-container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <HiSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem', color: 'var(--text-muted)', zIndex: 1 }} />
          <input
            id="search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs, topics, tags..."
            style={{
              width: '100%',
              paddingLeft: '3.5rem', paddingRight: '3rem',
              paddingTop: '1.1rem', paddingBottom: '1.1rem',
              fontSize: '1.05rem',
              borderRadius: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-main)',
              color: 'var(--text-main)',
              outline: 'none',
              boxShadow: 'var(--shadow)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary-500)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
            >
              <HiX style={{ fontSize: '1.2rem' }} />
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold font-poppins mb-2">No results found</h3>
            <p className="text-content-light-muted dark:text-content-dark-muted">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-content-light-muted dark:text-content-dark-muted mb-6">
              Found <strong>{results.length}</strong> results for &quot;<strong>{debouncedQuery}</strong>&quot;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">✨</span>
            <h3 className="text-lg font-bold font-poppins mb-2">Start typing to search</h3>
            <p className="text-content-light-muted dark:text-content-dark-muted text-sm">
              Press <kbd className="px-2 py-1 rounded-lg bg-primary-100 dark:bg-surface-dark-3 text-xs font-mono">⌘K</kbd> to focus
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
