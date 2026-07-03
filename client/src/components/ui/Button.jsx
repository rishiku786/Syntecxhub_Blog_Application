import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-indigo text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40',
  secondary: 'bg-white dark:bg-surface-dark-2 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-glass-border-dark hover:bg-primary-50 dark:hover:bg-surface-dark-3',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25',
  ghost: 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-surface-dark-3',
  outline: 'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white',
};

// Sizes use consistent h-* values to guarantee equal height across the page
const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
  xl: 'h-14 px-8 text-base gap-2.5',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
  style = {},
  ...props
}) => {
  const padLeftRight = size === 'sm' ? '0.85rem' : size === 'md' ? '1.35rem' : size === 'lg' ? '1.75rem' : '2.25rem';
  const padTopBottom = size === 'sm' ? '0.4rem' : size === 'md' ? '0.55rem' : size === 'lg' ? '0.65rem' : '0.85rem';
  const heightVal = size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : size === 'lg' ? '2.75rem' : '3.5rem';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative inline-flex items-center justify-center
        font-semibold whitespace-nowrap
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ripple
        ${variants[variant]}
        ${className}
      `}
      style={{
        paddingLeft: padLeftRight,
        paddingRight: padLeftRight,
        paddingTop: padTopBottom,
        paddingBottom: padTopBottom,
        height: heightVal,
        borderRadius: '0.75rem',
        ...style
      }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="text-base flex-shrink-0" style={{ display: 'flex', alignItems: 'center', marginRight: '0.45rem' }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
