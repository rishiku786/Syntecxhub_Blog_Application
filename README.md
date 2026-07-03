# 📝 BlogVerse - Premium MERN Stack Blog Application

BlogVerse is a modern, feature-rich, and premium blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). It offers a stunning UI/UX, user auth, dynamic writing dashboard, and private bookmarking features.

---

## 🌟 Key Features

- **Guest Landing Page**: Sleek, unauthenticated landing page highlighting site capabilities with an interactive rich-text editor mockup.
- **Unified Premium Blog Cards**: Consistent, elegant, glassmorphic layout across all feed, profile, and search pages.
- **Likes & Comments Control**: Secure, user-scoped like/unlike toggles for blogs and comments.
- **Bookmarks Isolation**: Separated local bookmark lists per logged-in user.
- **Rich Text Editor**: Seamless blog drafting experience.
- **Responsive Layout**: Pixel-perfect viewports optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly Cookies

---

## 🚀 Installation & Local Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rishiku786/Syntecxhub_Blog_Application.git
   cd Syntecxhub_Blog_Application
   ```

2. **Install Dependencies**:
   Install all node packages concurrently:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory and configure the database link:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blogverse
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

4. **Run in Development Mode**:
   Start both client and server development servers concurrently:
   ```bash
   npm run dev
   ```

---

## 📝 Authors & License

Developed by **Rishav** & Antigravity (Google DeepMind).
Released under the MIT License.
