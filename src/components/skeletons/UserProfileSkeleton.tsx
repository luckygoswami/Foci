export function UserProfileSkeleton() {
  return (
    <>
      {/* Profile Header */}
      <div className="rounded-2xl bg-skeleton shadow p-6 text-center">
        <div className="size-40 mx-auto rounded-full bg-skeleton-foreground animate-pulse mb-4" />
        <div className="h-6 bg-skeleton-foreground rounded mx-auto w-32 mb-2 animate-pulse" />
        <div className="h-4 bg-skeleton-foreground rounded mx-auto w-24 mb-4 animate-pulse" />
        <div className="h-4 bg-skeleton-foreground rounded mx-auto w-48 animate-pulse" />
      </div>

      {/* Subject and Streak */}
      <div className="subjects-streak grid grid-cols-[2fr_1fr] gap-2">
        {/* Subjects skeleton */}
        <div className="subjects bg-skeleton shadow rounded-2xl p-4 overflow-hidden">
          <div className="h-5 bg-skeleton-foreground rounded w-20 mb-2 animate-pulse" />
          <div className="flex gap-2">
            {/* Subject tags skeleton */}
            <div className="h-6 bg-skeleton-foreground rounded-full px-3 py-1 w-16 animate-pulse" />
            <div className="h-6 bg-skeleton-foreground rounded-full px-3 py-1 w-20 animate-pulse" />
            <div className="h-6 bg-skeleton-foreground rounded-full px-3 py-1 w-14 animate-pulse" />
          </div>
        </div>

        {/* Streak skeleton */}
        <div className="streak bg-skeleton shadow rounded-2xl p-4">
          <div className="h-5 bg-skeleton-foreground rounded w-12 mb-2 animate-pulse" />
          <div className="flex items-baseline">
            <div className="h-8 bg-skeleton-foreground rounded w-8 animate-pulse" />
            <div className="h-6 w-6 bg-skeleton-foreground rounded ml-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Study Stats */}
      <div className="study-stats bg-skeleton shadow rounded-2xl p-4">
        <div className="h-5 bg-skeleton-foreground rounded w-24 mb-2 animate-pulse" />
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {/* Today stat */}
          <div className="border-r border-gray-300">
            <div className="h-7 bg-skeleton-foreground rounded w-12 mx-auto mb-1 animate-pulse" />
            <div className="h-4 bg-skeleton-foreground rounded w-10 mx-auto animate-pulse" />
          </div>

          {/* This Week stat */}
          <div>
            <div className="h-7 bg-skeleton-foreground rounded w-10 mx-auto mb-1 animate-pulse" />
            <div className="h-4 bg-skeleton-foreground rounded w-16 mx-auto animate-pulse" />
          </div>

          {/* Total stat */}
          <div className="border-l border-gray-300">
            <div className="h-7 bg-skeleton-foreground rounded w-12 mx-auto mb-1 animate-pulse" />
            <div className="h-4 bg-skeleton-foreground rounded w-8 mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* Friends And Joined */}
      <div className="friends-joined grid grid-cols-2 gap-2">
        {/* Buddies skeleton */}
        <div className="shadow bg-skeleton rounded-2xl p-4">
          <div className="h-5 bg-skeleton-foreground rounded w-14 mb-2 animate-pulse" />
          <div className="flex -space-x-2">
            {/* Friend avatars skeleton */}
            <div className="size-8 rounded-full bg-skeleton-foreground border-2 border-card animate-pulse" />
            <div className="size-8 rounded-full bg-skeleton-foreground border-2 border-card animate-pulse" />
            <div className="size-8 rounded-full bg-skeleton-foreground border-2 border-card animate-pulse" />
          </div>
        </div>

        {/* Joined skeleton */}
        <div className="shadow bg-skeleton rounded-2xl p-4">
          <div className="h-5 bg-skeleton-foreground rounded w-12 mb-2 animate-pulse" />
          <div className="h-5 bg-skeleton-foreground rounded w-20 animate-pulse" />
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-skeleton-foreground rounded-2xl shadow animate-pulse" />
    </>
  );
}
