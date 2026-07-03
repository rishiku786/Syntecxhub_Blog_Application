import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
