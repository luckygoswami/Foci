export function GroupDetailsPageSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      {/* Group Details */}
      <div className="group-details overflow-scroll no-scrollbar flex flex-col items-center py-2">
        <div className="size-35 border-2 border-muted rounded-full bg-skeleton-foreground animate-pulse" />
        <div className="h-9 bg-skeleton-foreground rounded w-48  mt-4 mb-1 animate-pulse" />

        <div className="text-center mb-1 space-y-1">
          <div className="h-4 bg-skeleton-foreground rounded w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-skeleton-foreground rounded w-48 mx-auto animate-pulse" />
        </div>

        <div className="mt-2">
          <div className="h-4 bg-skeleton-foreground rounded w-56 animate-pulse" />
        </div>
      </div>

      {/* Group Members */}
      <div className="relative h-5/12">
        <ol className="h-full overflow-hidden py-2 divide-muted divide-y-1">
          {skeletonItems.map((index) => (
            <li
              key={index}
              className="flex items-center px-3 py-2">
              {/* Avatar skeleton */}
              <div className="rounded-full size-11 bg-skeleton-foreground animate-pulse mr-3" />

              {/* Name and role skeleton */}
              <div>
                <div className="h-5 bg-skeleton-foreground rounded w-24 mb-1 animate-pulse" />
                <div className="h-4 bg-skeleton-foreground rounded w-16 animate-pulse" />
              </div>
            </li>
          ))}
        </ol>
        <div className="list-skeleton-gradient pointer-events-none" />
      </div>

      {/* Action Button */}
      <div className="rounded-xl h-1/12 bg-skeleton-foreground animate-pulse" />
    </>
  );
}
