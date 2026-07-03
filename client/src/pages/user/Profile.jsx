import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUsers, HiHeart, HiDocumentText, HiCalendar, HiGlobe, HiPencil } from 'react-icons/hi';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import BlogCard from '../../components/blog/BlogCard';
import { BlogCardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { userService, uploadService } from '../../services/blogService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const compressImage = (file, maxWidth = 300, maxHeight = 300) => {
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

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogCount, setBlogCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '', socialLinks: {} });

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Reset edit form when modal is closed
  useEffect(() => {
    if (!editOpen && profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        socialLinks: profile.socialLinks || {},
      });
    }
  }, [editOpen, profile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getProfile(id);
      setProfile(data.user);
      setBlogs(data.blogs || []);
      setBlogCount(data.blogCount || 0);
      setTotalLikes(data.likedBlogsCount || data.totalLikes || 0);
      setIsFollowing(data.user.followers?.some((f) => f._id === currentUser?._id));
      setEditForm({
        name: data.user.name, bio: data.user.bio || '',
        avatar: data.user.avatar || '',
        socialLinks: data.user.socialLinks || {},
      });
    } catch { toast.error('Profile not found'); } finally { setLoading(false); }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      if (isFollowing) {
        await userService.unfollow(id);
        setIsFollowing(false);
        setProfile((p) => ({ ...p, followers: p.followers.filter((f) => f._id !== currentUser._id) }));
      } else {
        await userService.follow(id);
        setIsFollowing(true);
        setProfile((p) => ({ ...p, followers: [...p.followers, { _id: currentUser._id, name: currentUser.name, avatar: currentUser.avatar }] }));
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleEditSave = async () => {
    try {
      const { data } = await userService.updateProfile(editForm);
      if (data.success) {
        setProfile(data.user);
        updateUser(data.user);
        setEditOpen(false);
        toast.success('Profile updated! ✨');
      }
    } catch { toast.error('Update failed'); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading('Processing image...', { id: 'avatar' });
      
      // Compress the image locally to a tiny, high-quality avatar (max 300x300 JPEG)
      const compressedBase64 = await compressImage(file, 300, 300);
      
      // Set the local preview immediately!
      setEditForm((f) => ({ ...f, avatar: compressedBase64 }));

      // Now attempt backend upload
      try {
        toast.loading('Saving to server...', { id: 'avatar' });
        const { data } = await uploadService.uploadImage(file);
        if (data.success) {
          setEditForm((f) => ({ ...f, avatar: data.url }));
          toast.success('Avatar uploaded successfully! ✨', { id: 'avatar' });
        }
      } catch {
        // Fallback to our compressed base64 local preview
        toast.success('Avatar preview saved offline ✨', { id: 'avatar' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image locally', { id: 'avatar' });
    }
  };

  const getLikesCount = () => {
    let mockLikesCount = 0;
    if (isOwnProfile) {
      const userId = currentUser?._id || 'guest';
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mock_like_') && key.endsWith(`_${userId}`)) {
          if (localStorage.getItem(key) === 'true') {
            mockLikesCount++;
          }
        }
      }
    }
    return totalLikes + mockLikesCount;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="flex items-center gap-6">
          <div className="skeleton w-24 h-24 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-40"><span className="text-6xl">😕</span><p className="mt-4">Profile not found</p></div>;

  return (
    <div className="bv-container" style={{ maxWidth: '1000px', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          boxShadow: 'var(--shadow)',
          borderRadius: '1.5rem',
          marginBottom: '2.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Banner header */}
        <div className="w-full h-36 gradient-bg opacity-80" />

        {/* Profile Details Section */}
        <div style={{ padding: '1.5rem 1.5rem 2rem', position: 'relative' }}>
          
          {/* Avatar - absolutely positioned on desktop */}
          <div style={{
            position: 'absolute',
            top: '-4.5rem',
            left: '2rem',
            zIndex: 10,
          }} className="hidden sm:block">
            <img
              src={profile.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`}
              alt={profile.name}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-surface-dark-2 shadow-lg object-cover"
            />
          </div>

          {/* User info row */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            {/* Mobile Avatar (centered, hidden on desktop) */}
            <div className="sm:hidden w-full flex justify-center" style={{ marginTop: '-5rem', marginBottom: '0.5rem' }}>
              <img
                src={profile.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl border-4 border-white dark:border-surface-dark-2 shadow-lg object-cover"
              />
            </div>

            {/* User info container */}
            <div className="flex-1 min-w-0 text-center sm:text-left profile-details-wrapper">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold font-poppins truncate">{profile.name}</h1>
                <Badge color={profile.role === 'admin' ? 'red' : profile.role === 'author' ? 'purple' : 'blue'} className="flex-shrink-0">
                  {profile.role}
                </Badge>
              </div>
              {profile.bio && <p className="text-sm text-content-light-muted dark:text-content-dark-muted mb-2 line-clamp-2">{profile.bio}</p>}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-content-light dark:text-content-dark font-medium">
                <span className="flex items-center gap-1"><HiCalendar className="flex-shrink-0" /> Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            {/* Action buttons (Edit Profile) */}
            <div className="flex gap-2 justify-center sm:justify-start w-full sm:w-auto pt-2 sm:pt-0">
              {isOwnProfile ? (
                <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)} icon={<HiPencil />}>Edit Profile</Button>
              ) : (
                <Button variant={isFollowing ? 'secondary' : 'primary'} size="sm" onClick={handleFollow}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" style={{ marginTop: '3.5rem' }}>
            {[
              { label: 'Posts', value: blogCount, icon: <HiDocumentText className="text-primary-500 text-xl sm:text-2xl" />, bg: 'rgba(226, 55, 68, 0.08)' },
              { label: 'Followers', value: profile.followers?.length || 0, icon: <HiUsers className="text-pink-500 text-xl sm:text-2xl" />, bg: 'rgba(236, 72, 153, 0.08)' },
              { label: 'Following', value: profile.following?.length || 0, icon: <HiUsers className="text-blue-500 text-xl sm:text-2xl" />, bg: 'rgba(59, 130, 246, 0.08)' },
              { label: 'Likes', value: getLikesCount(), icon: <HiHeart className="text-red-500 text-xl sm:text-2xl" />, bg: 'rgba(239, 68, 68, 0.08)' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl border border-primary-100 dark:border-glass-border-dark"
                style={{
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow)',
                  minHeight: '135px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl font-extrabold mb-0.5" style={{ color: 'var(--text-main)', fontFamily: '"Poppins", sans-serif' }}>{stat.value}</p>
                <p className="text-xs text-content-light-muted dark:text-content-dark-muted font-bold tracking-wider uppercase" style={{ fontSize: '0.68rem' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
            <div className="flex gap-3 mt-5 justify-center sm:justify-start">
              {profile.socialLinks.website && <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3"><HiGlobe className="text-lg" /></a>}
              {profile.socialLinks.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3"><FaTwitter className="text-lg" /></a>}
              {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3"><FaGithub className="text-lg" /></a>}
              {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3"><FaLinkedin className="text-lg" /></a>}
            </div>
          )}
        </div>
      </motion.div>

      {/* User Blogs */}
      <h2 className="text-xl sm:text-2xl font-bold font-poppins mb-6">Posts by {profile.name}</h2>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 flex flex-col items-center">
          <span className="text-4xl sm:text-5xl block mb-3">📝</span>
          <p className="text-content-light-muted dark:text-content-dark-muted text-sm sm:text-base">No published posts yet</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="md">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <img 
              src={editForm.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${editForm.name}`} 
              alt="" 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/20 shadow-md" 
            />
            <label className="cursor-pointer">
              <span className="text-sm font-semibold text-primary-600 hover:underline">Change Avatar</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          
          <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          
          <div>
            <label className="block text-sm font-semibold text-content-light dark:text-content-dark mb-1.5">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              maxLength={300}
              rows={3}
              className="w-full rounded-xl bg-white dark:bg-surface-dark-2 border border-primary-100 dark:border-glass-border-dark focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm resize-none transition-all duration-200 text-content-light dark:text-content-dark shadow-sm"
              style={{ padding: '0.75rem 1rem' }}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <Input label="Website" value={editForm.socialLinks?.website || ''} onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, website: e.target.value } })} placeholder="https://yoursite.com" />
          <Input label="Twitter" value={editForm.socialLinks?.twitter || ''} onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, twitter: e.target.value } })} placeholder="https://twitter.com/you" />
          <Input label="GitHub" value={editForm.socialLinks?.github || ''} onChange={(e) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, github: e.target.value } })} placeholder="https://github.com/you" />
          
          <div className="flex gap-3 pt-4 pb-4">
            <Button onClick={handleEditSave} className="flex-1">Save Changes</Button>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
