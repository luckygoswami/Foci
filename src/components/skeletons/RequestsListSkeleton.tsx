import type { Ref } from 'react';

export function RequestsListSkeleton({
  requestListRef,
}: {
  requestListRef: Ref<HTMLOListElement>;
}) {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <ol
      ref={requestListRef}
      className="space-y-2 pb-1 relative">
      {skeletonItems.map((index) => (
        <li
          key={index}
          className="flex items-center gap-4 rounded-xl px-5 py-3 bg-card border border-muted-foreground/10 shadow-xs">
          {/* Avatar skeleton */}
          <div className="size-20 rounded-full bg-skeleton-foreground animate-pulse" />

          {/* Meta skeleton */}
          <div className="flex flex-col gap-0.5 flex-1">
            {/* Name skeleton */}
            <div className="h-4 bg-skeleton-foreground rounded w-28 animate-pulse" />

            {/* Time ago skeleton */}
            <div className="h-3 bg-skeleton-foreground rounded w-16 animate-pulse" />

            {/* Action buttons skeleton */}
            <div className="flex gap-2 mt-1">
              <div className="w-22 h-8 bg-skeleton-foreground rounded-lg animate-pulse" />
              <div className="w-22 h-8 bg-skeleton-foreground rounded-lg animate-pulse" />
            </div>
          </div>
        </li>
      ))}
      <div className="list-skeleton-gradient" />
    </ol>
  );
}
