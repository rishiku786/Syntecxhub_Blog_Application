import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPhotograph, HiX, HiCloudUpload } from 'react-icons/hi';
import TiptapEditor from '../../components/editor/TiptapEditor';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { blogService, categoryService, uploadService } from '../../services/blogService';
import toast from 'react-hot-toast';

const compressImage = (file, maxWidth = 1000, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as compressed JPEG (0.7 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: '', subtitle: '', content: '', coverImage: '', tags: '', category: '', status: 'draft',
  });
  const [categories, setCategories] = useState([]);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.categories || []));
    if (isEditing) {
      blogService.getBySlug(id).then(({ data }) => {
        const b = data.blog;
        setForm({
          title: b.title, subtitle: b.subtitle || '', content: b.content,
          coverImage: b.coverImage || '', tags: b.tags?.join(', ') || '',
          category: b.category?._id || '', status: b.status,
        });
        setCoverPreview(b.coverImage || '');
      }).catch(() => toast.error('Blog not found'));
    }
  }, [id]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => {
      if (footer) footer.style.display = '';
    };
  }, []);

  const handleCoverUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      toast.loading('Processing image...', { id: 'cover' });
      
      // Compress the cover image locally
      const compressedBase64 = await compressImage(file, 1000, 600);
      
      // Set the local preview immediately!
      setForm((f) => ({ ...f, coverImage: compressedBase64 }));
      setCoverPreview(compressedBase64);

      // Now attempt backend upload
      try {
        toast.loading('Saving to server...', { id: 'cover' });
        const { data } = await uploadService.uploadImage(file);
        if (data.success) {
          setForm((f) => ({ ...f, coverImage: data.url }));
          setCoverPreview(data.url);
          toast.success('Cover uploaded successfully! 🖼️', { id: 'cover' });
        }
      } catch {
        // Fallback to our compressed base64 local preview
        toast.success('Cover preview saved offline 🖼️', { id: 'cover' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image locally', { id: 'cover' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleCoverUpload(file);
  }, []);

  const handleSubmit = async (status) => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.content.trim() || form.content === '<p></p>') return toast.error('Content is required');

    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        category: form.category || undefined,
      };

      if (isEditing) {
        await blogService.update(id, payload);
        toast.success('Blog updated! ✅');
      } else {
        await blogService.create(payload);
        toast.success(status === 'published' ? 'Blog published! 🎉' : 'Draft saved! 📝');
      }
      navigate('/dashboard/my-blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-5.5rem)] lg:overflow-hidden w-full" style={{ background: 'var(--bg-main)' }}>
      {/* Left Part: Cover Image Upload */}
      <div className="w-full lg:w-[45%] flex items-center justify-center relative p-6 bg-white dark:bg-surface-dark-2 lg:border-r border-primary-100 dark:border-glass-border-dark min-h-[320px] lg:min-h-0 overflow-hidden">
        {coverPreview && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${coverPreview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) brightness(0.3)',
              transform: 'scale(1.15)',
              zIndex: 0
            }}
          />
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '480px',
            borderRadius: '1.25rem',
            border: dragActive ? '2px dashed #e23744' : '2px dashed rgba(255, 255, 255, 0.15)',
            background: dragActive ? 'rgba(226, 55, 68, 0.08)' : 'rgba(15, 10, 26, 0.65)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            aspectRatio: '16/10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          {coverPreview ? (
            <div className="relative w-full h-full">
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              <button
                onClick={() => { setForm((f) => ({ ...f, coverImage: '' })); setCoverPreview(''); }}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/85 cursor-pointer transition-colors"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
              >
                <HiX className="text-base" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center select-none">
              {uploading ? (
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-[#e23744] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-content-light-muted">Uploading...</p>
                </div>
              ) : (
                <>
                  <HiCloudUpload className="text-4xl text-[#ff7e8b] mb-3 animate-pulse" />
                  <p className="text-sm font-semibold text-white">Drag & drop or click to upload</p>
                  <p className="text-xs text-content-light-muted mt-1.5">PNG, JPG or WEBP up to 5MB</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Right Part: Editor Form Details */}
      <div 
        className="w-full lg:w-[55%] lg:h-full flex flex-col justify-between overflow-hidden"
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '2.5rem',
          paddingRight: '2rem',
        }}
      >
        {/* Scrollable Form Content */}
        <div className="flex-1 lg:overflow-y-auto pr-2 pb-8 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: '"Poppins", sans-serif', color: '#fff', margin: 0 }}>
              {isEditing ? 'Edit Blog ✏️' : 'Create New Blog ✨'}
            </h1>

            <div className="space-y-5">
              {/* Title */}
              <Input
                placeholder="Blog Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: '"Poppins", sans-serif',
                  boxShadow: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              />

              {/* Subtitle */}
              <Input
                placeholder="Add a subtitle (optional)"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontSize: '1.15rem',
                  color: '#94a3b8',
                  boxShadow: 'none',
                  borderRadius: 0,
                }}
              />

              {/* Editor */}
              <TiptapEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />

              {/* Tags & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tags (comma separated)"
                  placeholder="react, javascript, web dev"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-medium" style={{ color: '#e2e8f0' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{
                      width: '100%',
                      paddingTop: '0.7rem',
                      paddingBottom: '0.7rem',
                      paddingRight: '1.25rem',
                      paddingLeft: '1rem',
                      borderRadius: '0.75rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-main)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pinned Actions Footer */}
        <div className="flex flex-wrap gap-3 border-t border-primary-100 dark:border-glass-border-dark mt-6 z-10 bg-[var(--bg-main)]" style={{ paddingTop: '1.75rem' }}>
          <Button onClick={() => handleSubmit('published')} loading={saving} size="lg">
            {isEditing ? 'Update & Publish' : '🚀 Publish'}
          </Button>
          <Button variant="secondary" onClick={() => handleSubmit('draft')} loading={saving} size="lg">
            💾 Save Draft
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)} size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
