import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl sm:text-9xl font-black font-poppins brand-text mb-6"
        >
          404
        </motion.div>

        <h1 className="text-2xl font-bold font-poppins mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-content-light-muted dark:text-content-dark-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track! 🧭
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button size="lg">🏠 Go Home</Button>
          </Link>
          <Link to="/blogs">
            <Button variant="secondary" size="lg">📚 Browse Blogs</Button>
          </Link>
        </div>

        {/* Floating decorations */}
        <div className="relative mt-12 h-20">
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            className="absolute left-1/4 text-3xl"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute left-1/2 text-3xl"
          >
            🚀
          </motion.span>
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute right-1/4 text-3xl"
          >
            💫
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
