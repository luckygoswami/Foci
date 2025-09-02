export function GroupsListSkeleton() {
  const skeletonItems = Array.from({ length: 4 }, (_, i) => i);

  return (
    <ol className="space-y-2 pb-1 relative">
      {skeletonItems.map((index) => (
        <li
          key={index}
          className="flex items-center gap-4 rounded-xl px-5 py-4 bg-card border border-muted-foreground/10 shadow-xs">
          {/* Avatar skeleton */}
          <div className="size-13 bg-skeleton-foreground rounded-xl animate-pulse" />

          {/* Meta skeleton */}
          <div className="flex flex-col flex-1 min-w-0 gap-2">
            {/* Group name skeleton */}
            <div className="h-5 bg-skeleton-foreground rounded w-32 animate-pulse" />

            {/* Member count and privacy badge skeleton */}
            <div className="flex gap-2 items-center">
              <div className="h-4 bg-skeleton-foreground rounded w-20 animate-pulse" />
              <div className="h-5 bg-skeleton-foreground rounded-full px-2 py-0.5 w-16 animate-pulse" />
            </div>
          </div>

          {/* Arrow skeleton */}
          <div className="w-6 h-6 bg-skeleton-foreground rounded animate-pulse" />
        </li>
      ))}
      <div className="list-skeleton-gradient" />
    </ol>
  );
}
