import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import CreateBlog from './pages/blog/CreateBlog';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogDetails = lazy(() => import('./pages/blog/BlogDetails'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Bookmarks = lazy(() => import('./pages/user/Bookmarks'));
const Settings = lazy(() => import('./pages/user/Settings'));
const Search = lazy(() => import('./pages/Search'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MyBlogs = lazy(() => import('./pages/dashboard/MyBlogs'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-content-light-muted dark:text-content-dark-muted">Loading...</p>
    </div>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
};

// Guest-only Route
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Protected - any authenticated user */}
          <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
          <Route path="/blog/:slug" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Protected - author/admin */}
          <Route path="/create" element={<ProtectedRoute roles={['author', 'admin']}><CreateBlog /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute roles={['author', 'admin']}><CreateBlog /></ProtectedRoute>} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* Dashboard routes */}
        <Route element={<ProtectedRoute roles={['author', 'admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/my-blogs" element={<MyBlogs />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '16px',
                background: 'var(--color-surface-light)',
                color: 'var(--color-content-light)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                padding: '12px 20px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
