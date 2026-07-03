import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
      default: '',
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    scheduledAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate unique slug before save
blogSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  
  let slug = slugify(this.title, { lower: true, strict: true });
  
  // Ensure uniqueness
  const existingBlog = await mongoose.model('Blog').findOne({ slug });
  if (existingBlog && existingBlog._id.toString() !== this._id?.toString()) {
    slug = `${slug}-${Date.now()}`;
  }
  
  this.slug = slug;
  next();
});

// Index for search
blogSchema.index({ title: 'text', subtitle: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
