const Skeleton = ({ className = '', variant = 'rect', count = 1 }) => {
  const baseClass = 'skeleton animate-pulse';

  const shapes = {
    rect: 'h-4 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-64 w-full rounded-2xl',
    title: 'h-6 w-3/4 rounded-lg',
    text: 'h-4 w-full rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
    image: 'h-48 w-full rounded-xl',
    button: 'h-10 w-28 rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${shapes[variant] || shapes.rect} ${className}`}
        />
      ))}
    </>
  );
};

export const BlogCardSkeleton = () => (
  <div className="bg-white dark:bg-surface-dark-2 rounded-2xl overflow-hidden shadow-sm">
    <Skeleton variant="image" />
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="avatar" className="h-6 w-6" />
        <Skeleton variant="text" className="w-24 h-3" />
      </div>
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" className="w-16 h-6" />
        <Skeleton variant="button" className="w-16 h-6" />
      </div>
    </div>
  </div>
);

export default Skeleton;
