import type { Ref } from 'react';

export function InvitesListSkeleton({
  inviteListRef,
}: {
  inviteListRef: Ref<HTMLOListElement>;
}) {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <ol
      ref={inviteListRef}
      className="space-y-2 pb-1 relative">
      {skeletonItems.map((index) => (
        <li
          key={index}
          className="flex items-center gap-4 rounded-xl px-5 py-3 bg-card border border-muted-foreground/10 shadow-xs">
          {/* Avatar skeleton */}
          <div className="size-20 rounded-lg bg-skeleton-foreground animate-pulse" />

          {/* Meta skeleton */}
          <div className="flex flex-col gap-0.5 flex-1">
            {/* Group name skeleton */}
            <div className="h-4 bg-skeleton-foreground rounded w-20 animate-pulse" />

            {/* Sender name skeleton */}
            <div className="h-3 bg-skeleton-foreground rounded w-35 animate-pulse" />

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
