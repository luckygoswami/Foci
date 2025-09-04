export function FriendsInviteModalSkeleton() {
  const skeletonItems = Array.from({ length: 4 }).map((_, idx) => idx);

  return (
    <ol className="h-55 divide-y divide-muted overflow-hidden relative">
      {skeletonItems.map((idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 p-2">
          <div className="size-12 rounded-full bg-skeleton-foreground animate-pulse" />
          <div className="w-40 h-6 bg-skeleton-foreground animate-pulse" />
          <div className="h-8 w-20 ml-auto rounded-sm bg-skeleton-foreground animate-pulse" />
        </li>
      ))}
      <div className="list-skeleton-gradient" />
    </ol>
  );
}
