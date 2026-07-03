import { motion } from 'framer-motion';

const colorMap = {
  purple: { bg: 'rgba(226, 55, 68, 0.12)', text: '#ff7e8b', border: 'rgba(226, 55, 68, 0.25)' },
  pink:   { bg: 'rgba(226, 55, 68, 0.12)', text: '#ff7e8b', border: 'rgba(226, 55, 68, 0.25)' },
  blue:   { bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd', border: 'rgba(59, 130, 246, 0.25)' },
  green:  { bg: 'rgba(16, 185, 129, 0.15)', text: '#a7f3d0', border: 'rgba(16, 185, 129, 0.25)' },
  amber:  { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde68a', border: 'rgba(245, 158, 11, 0.25)' },
  red:    { bg: 'rgba(226, 55, 68, 0.15)', text: '#ff7e8b', border: 'rgba(226, 55, 68, 0.3)' },
  gray:   { bg: 'rgba(255, 255, 255, 0.06)', text: '#94a3b8', border: 'rgba(255, 255, 255, 0.1)' },
};

const Badge = ({ children, color = 'purple', className = '', style = {}, dot = false }) => {
  const currentTheme = colorMap[color] || colorMap.purple;

  return (
    <motion.span
      whileHover={{ y: -1, scale: 1.02 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.75rem',
        fontSize: '0.72rem',
        fontWeight: 700,
        borderRadius: '9999px',
        background: currentTheme.bg,
        color: currentTheme.text,
        border: `1px solid ${currentTheme.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
      className={className}
    >
      {dot && (
        <span
          style={{
            width: '0.35rem',
            height: '0.35rem',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </motion.span>
  );
};

export default Badge;
