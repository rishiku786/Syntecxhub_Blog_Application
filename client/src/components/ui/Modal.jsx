import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-white dark:bg-surface-dark-2
              rounded-2xl shadow-2xl
              max-h-[90vh] overflow-y-auto
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-primary-100 dark:border-glass-border-dark" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="text-xl font-bold font-poppins">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-dark-3 transition-colors cursor-pointer"
                >
                  <HiX className="text-xl" />
                </motion.button>
              </div>
            )}

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
