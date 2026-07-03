import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiReply, HiPencil, HiTrash } from 'react-icons/hi';
import { commentService } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/helpers';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const { data } = await commentService.getByBlog(blogId);
      if (data.success) setComments(data.comments);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await commentService.create(blogId, { content: newComment });
      if (data.success) {
        setComments([{ ...data.comment, replies: [] }, ...comments]);
        setNewComment('');
        toast.success('Comment added! 💬');
      }
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      const { data } = await commentService.create(blogId, {
        content: replyContent,
        parentComment: commentId,
      });
      if (data.success) {
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? { ...c, replies: [...(c.replies || []), data.comment] }
              : c
          )
        );
        setReplyTo(null);
        setReplyContent('');
        toast.success('Reply added!');
      }
    } catch {
      toast.error('Failed to reply');
    }
  };

  const handleEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      const { data } = await commentService.update(id, { content: editContent });
      if (data.success) {
        const updateComments = (list) =>
          list.map((c) => {
            if (c._id === id) return { ...c, content: editContent };
            if (c.replies) return { ...c, replies: updateComments(c.replies) };
            return c;
          });
        setComments(updateComments(comments));
        setEditingId(null);
        toast.success('Comment updated');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    try {
      await commentService.delete(id);
      const filterComments = (list) =>
        list
          .filter((c) => c._id !== id)
          .map((c) => (c.replies ? { ...c, replies: filterComments(c.replies) } : c));
      setComments(filterComments(comments));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLike = async (id) => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      const { data } = await commentService.toggleLike(id);
      const updateLikes = (list) =>
        list.map((c) => {
          if (c._id === id) {
            const likes = data.liked
              ? [...(c.likes || []), user._id]
              : (c.likes || []).filter((l) => l !== user._id);
            return { ...c, likes };
          }
          if (c.replies) return { ...c, replies: updateLikes(c.replies) };
          return c;
        });
      setComments(updateLikes(comments));
    } catch { /* silent */ }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <motion.div
      initial={{ opacity: 0, x: isReply ? 20 : 0, y: isReply ? 0 : 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={`${isReply ? 'ml-5 sm:ml-8 mt-3' : 'mt-4'}`}
    >
      <div className="flex gap-3">
        <img
          src={comment.author?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${comment.author?.name}`}
          alt={comment.author?.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-surface-light-2 dark:bg-surface-dark-3 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">{comment.author?.name}</span>
              <span className="text-xs text-content-light-muted dark:text-content-dark-muted">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            {editingId === comment._id ? (
              <div className="flex gap-2 mt-1">
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 min-w-0 text-sm bg-white dark:bg-surface-dark-2 rounded-lg px-3 py-1.5 border border-primary-200 dark:border-glass-border-dark focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button onClick={() => handleEdit(comment._id)} className="text-xs text-primary-600 font-semibold cursor-pointer">Save</button>
                <button onClick={() => setEditingId(null)} className="text-xs text-content-light-muted cursor-pointer">Cancel</button>
              </div>
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1.5 ml-2">
            <button
              onClick={() => handleLike(comment._id)}
              className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${
                comment.likes?.includes(user?._id) ? 'text-accent-pink' : 'text-content-light-muted dark:text-content-dark-muted hover:text-accent-pink'
              }`}
            >
              <HiHeart className="text-sm" /> {comment.likes?.length || 0}
            </button>
            {isAuthenticated && !isReply && (
              <button
                onClick={() => { setReplyTo(replyTo === comment._id ? null : comment._id); setReplyContent(''); }}
                className="flex items-center gap-1 text-xs text-content-light-muted dark:text-content-dark-muted hover:text-primary-600 cursor-pointer"
              >
                <HiReply className="text-sm" /> Reply
              </button>
            )}
            {user?._id === comment.author?._id && (
              <>
                <button
                  onClick={() => { setEditingId(comment._id); setEditContent(comment.content); }}
                  className="flex items-center gap-1 text-xs text-content-light-muted hover:text-primary-600 cursor-pointer"
                >
                  <HiPencil className="text-sm" />
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="flex items-center gap-1 text-xs text-content-light-muted hover:text-red-500 cursor-pointer"
                >
                  <HiTrash className="text-sm" />
                </button>
              </>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {replyTo === comment._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-w-0 text-sm bg-white dark:bg-surface-dark-2 rounded-xl px-4 py-2 border border-primary-200 dark:border-glass-border-dark focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <Button size="sm" onClick={() => handleReply(comment._id)}>
                  Reply
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies?.map((reply) => (
            <CommentItem key={reply._id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold font-poppins mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
          <img
            src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-9 h-9 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 min-w-0 bg-surface-light-2 dark:bg-surface-dark-3 rounded-xl px-4 py-2.5 text-sm border border-primary-200 dark:border-glass-border-dark focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <Button type="submit" size="sm">Post</Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-content-light-muted dark:text-content-dark-muted mb-6">
          <a href="/login" className="text-primary-600 font-semibold">Login</a> to leave a comment
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-16 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-content-light-muted dark:text-content-dark-muted py-8">
          No comments yet. Be the first to share your thoughts! 💭
        </p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
