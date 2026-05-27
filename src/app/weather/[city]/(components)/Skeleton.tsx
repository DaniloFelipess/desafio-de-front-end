export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block animate-pulse rounded-sm bg-current opacity-25 ${className}`}
      aria-hidden="true"
    />
  );
}
