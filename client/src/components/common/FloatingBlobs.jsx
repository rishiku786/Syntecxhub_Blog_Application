const FloatingBlobs = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Top-left blob */}
      <div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 dark:opacity-10 animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)',
        }}
      />
      {/* Top-right blob */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 dark:opacity-10 animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
        }}
      />
      {/* Bottom-left blob */}
      <div
        className="absolute -bottom-40 left-1/4 w-72 h-72 rounded-full opacity-15 dark:opacity-8 animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
        }}
      />
      {/* Center blob */}
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 dark:opacity-5 animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default FloatingBlobs;
