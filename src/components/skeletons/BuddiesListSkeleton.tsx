export function BuddiesListSkeleton() {
  const skeletonItems = Array.from({ length: 4 }, (_, i) => i);

  return (
    <ol className="space-y-2 pb-1 relative">
      {skeletonItems.map((index) => (
        <li
          key={index}
          className="flex items-center gap-4 rounded-xl px-5 py-4 bg-card border border-muted-foreground/10 shadow-xs">
          {/* Avatar skeleton */}
          <div className="size-13 rounded-full bg-skeleton-foreground animate-pulse" />

          {/* Meta skeleton */}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            {/* Name skeleton */}
            <div className="h-5 bg-skeleton-foreground rounded w-32 animate-pulse" />

            {/* Time skeleton */}
            <div className="h-4 bg-skeleton-foreground rounded w-20 animate-pulse" />
          </div>
        </li>
      ))}
      <div className="list-skeleton-gradient" />
    </ol>
  );
}
