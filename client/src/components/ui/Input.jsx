import { forwardRef, useState } from 'react';

const Input = forwardRef(({ label, error, icon, className = '', style = {}, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 550, color: 'var(--text-main)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          style={{
            width: '100%',
            paddingTop: '0.7rem',
            paddingBottom: '0.7rem',
            paddingRight: '1rem',
            paddingLeft: icon ? '2.4rem' : '1rem',
            borderRadius: '0.75rem',
            background: 'var(--bg-card)',
            border: '1px solid',
            borderColor: error 
              ? '#ef4444' 
              : (isFocused ? '#e23744' : 'var(--border-main)'),
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: isFocused ? '0 0 12px rgba(226,55,68,0.15)' : 'none',
            ...style,
          }}
          {...props}
        />
      </div>
      {error && (
        <p style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
