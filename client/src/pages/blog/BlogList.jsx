import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiFilter, HiViewGrid, HiViewList, HiOutlineArrowRight } from 'react-icons/hi';
import PremiumBlogCard from '../../components/blog/PremiumBlogCard';
import { BlogCardSkeleton } from '../../components/ui/Skeleton';
import { blogService, categoryService } from '../../services/blogService';
import { MOCK_BLOGS_DETAILS } from '../../utils/mockBlogContents';

const MOCK_CATEGORIES = [
  { _id: 'tech', name: 'Technology', icon: '💻', slug: 'technology' },
  { _id: 'design', name: 'Design', icon: '🎨', slug: 'design' },
  { _id: 'travel', name: 'Travel', icon: '✈️', slug: 'travel' },
  { _id: 'business', name: 'Business', icon: '📈', slug: 'business' },
  { _id: 'health', name: 'Health', icon: '🧘', slug: 'health' },
  { _id: 'lifestyle', name: 'Lifestyle', icon: '☕', slug: 'lifestyle' },
];

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [viewMode, setViewMode] = useState('grid');

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentView = searchParams.get('view') || ''; // 'categories' or empty (blogs)

  useEffect(() => {
    categoryService.getAll().then(({ data }) => {
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    }).catch(() => {
      setCategories(MOCK_CATEGORIES);
    });
  }, []);

  useEffect(() => {
    if (currentView !== 'categories') {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [currentCategory, currentSort, currentPage, currentView, categories.length]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 12, sort: currentSort };
      
      let resolvedCategoryId = '';
      if (currentCategory) {
        // Resolve category name/slug to database ID
        const matchedCat = categories.find(
          c => c._id === currentCategory || 
               c.name.toLowerCase() === currentCategory.toLowerCase() ||
               c.slug?.toLowerCase() === currentCategory.toLowerCase()
        );
        if (matchedCat) {
          resolvedCategoryId = matchedCat._id;
        } else {
          resolvedCategoryId = currentCategory;
        }
      }

      // Check if it is a valid 24-character hexadecimal ObjectId
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      if (resolvedCategoryId && isValidObjectId(resolvedCategoryId)) {
        params.category = resolvedCategoryId;
      }
      
      const { data } = await blogService.getAll(params);
      
      const dbBlogs = data.blogs || [];

      // Get mock fallback list
      const mockList = Object.keys(MOCK_BLOGS_DETAILS).map(slug => ({
        ...MOCK_BLOGS_DETAILS[slug],
        slug
      }));
      
      let filteredMock = mockList;
      if (currentCategory) {
        const matchedCat = categories.find(
          c => c._id === currentCategory || 
               c.name.toLowerCase() === currentCategory.toLowerCase()
        );
        const catName = matchedCat ? matchedCat.name.toLowerCase() : currentCategory.toLowerCase();
        filteredMock = mockList.filter(b => b.category?.name?.toLowerCase() === catName);
      }

      // Combine database blogs and mock blogs (database blogs first)
      const combinedBlogs = [...dbBlogs, ...filteredMock];
      
      setBlogs(combinedBlogs);
      setPagination({
        page: currentPage,
        pages: Math.ceil(combinedBlogs.length / 12),
        total: combinedBlogs.length
      });
    } catch {
      // API error / offline fallback - must filter by category too!
      const mockList = Object.keys(MOCK_BLOGS_DETAILS).map(slug => ({
        ...MOCK_BLOGS_DETAILS[slug],
        slug
      }));
      
      let filteredMock = mockList;
      if (currentCategory) {
        const matchedCat = categories.find(
          c => c._id === currentCategory || 
               c.name.toLowerCase() === currentCategory.toLowerCase()
        );
        const catName = matchedCat ? matchedCat.name.toLowerCase() : currentCategory.toLowerCase();
        filteredMock = mockList.filter(b => b.category?.name?.toLowerCase() === catName);
      }
      
      setBlogs(filteredMock);
      setPagination({
        page: 1,
        pages: Math.ceil(filteredMock.length / 12),
        total: filteredMock.length
      });
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'mostViewed', label: 'Most Viewed' },
  ];

  /* ────────────────────────────────────────────────────────
     CATEGORIES LIST VIEW
  ──────────────────────────────────────────────────────── */
  if (currentView === 'categories') {
    return (
      <div className="bv-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontFamily: '"Poppins",sans-serif', fontWeight: 800, marginBottom: '0.5rem' }}>
            Explore by <span className="brand-text">Category</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Find amazing articles grouped by topics that interest you the most
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/blogs?category=${cat._id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '2rem 1.5rem',
                  borderRadius: '1.25rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-main)',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(226, 55, 68, 0.45)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(226, 55, 68, 0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-main)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
              >
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', textAlign: 'center' }}>{cat.icon || '📂'}</span>
                <h3 style={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {cat.name}
                </h3>
                {cat.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                    {cat.description}
                  </p>
                )}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ff7e8b',
                  transition: 'gap 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.gap = '0.6rem'}
                  onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}
                >
                  Explore Category <HiOutlineArrowRight />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────
     STANDARD BLOG LIST VIEW
  ──────────────────────────────────────────────────────── */
  return (
    <div className="bv-container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontFamily: '"Poppins",sans-serif', fontWeight: 800, marginBottom: '0.4rem' }}>
          Explore <span className="brand-text">Blogs</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Discover {pagination.total} amazing {pagination.total === 1 ? 'story' : 'stories'} from our community
        </p>
      </motion.div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          marginBottom: '2.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '1.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Responsive row wrapper */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          width: '100%',
        }}>
          {/* Left: Filter Icon & Scrollable Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 auto', minWidth: 0 }}>
            <HiFilter style={{ color: '#6b7280', fontSize: '1.25rem', flexShrink: 0 }} />
            <div className="filter-scroll" style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.4rem', width: 'max-content' }}>
                <button
                  onClick={() => updateParams('category', '')}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    transition: 'all 0.15s',
                    background: !currentCategory ? 'linear-gradient(135deg,#e23744,#ff7e8b)' : 'var(--bg-card-hover)',
                    color: !currentCategory ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const isSelected = currentCategory === cat._id || currentCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat._id}
                      onClick={() => updateParams('category', cat._id)}
                      style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        border: 'none',
                        transition: 'all 0.15s',
                        background: isSelected ? 'linear-gradient(135deg,#e23744,#ff7e8b)' : 'var(--bg-card-hover)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Sort Dropdown & Grid Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <select
              value={currentSort}
              onChange={(e) => updateParams('sort', e.target.value)}
              style={{
                padding: '0.45rem 1.75rem 0.45rem 0.75rem',
                borderRadius: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 650,
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-main)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{opt.label}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-card-hover)', padding: '0.2rem', borderRadius: '0.75rem', border: '1px solid var(--border-main)' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.55rem',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: viewMode === 'grid' ? '#e23744' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                aria-label="Grid view"
              >
                <HiViewGrid style={{ fontSize: '1.05rem' }} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.35rem',
                  borderRadius: '0.55rem',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: viewMode === 'list' ? '#e23744' : 'transparent',
                  color: viewMode === 'list' ? '#fff' : 'var(--text-muted)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                aria-label="List view"
              >
                <HiViewList style={{ fontSize: '1.05rem' }} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog Grid / List */}
      {!loading && blogs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5rem 1rem' }}>
          <span style={{ fontSize: '4.5rem', marginBottom: '1.25rem', display: 'block' }}>🔍</span>
          <h3 style={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No blogs found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.6 }}>
            Try adjusting your filters or search options to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              updateParams('category', '');
              updateParams('sort', '-createdAt');
            }}
            style={{
              padding: '0.65rem 1.5rem',
              borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #e23744, #ff7e8b)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(226,55,68,0.35)',
              fontFamily: 'inherit',
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog) => <PremiumBlogCard key={blog._id || blog.slug} blog={blog} />)
          }
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateParams('page', String(i + 1))}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.15s',
                background: currentPage === i + 1 ? 'linear-gradient(135deg,#e23744,#ff7e8b)' : 'var(--bg-card)',
                color: currentPage === i + 1 ? '#fff' : 'var(--text-muted)',
                boxShadow: currentPage === i + 1 ? '0 4px 16px rgba(226,55,68,0.35)' : 'none',
                fontFamily: 'inherit',
              }}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
