export function InsightsSkeleton() {
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  return (
    <tbody className="relative">
      {skeletonItems.map((i) => (
        <tr key={i}>
          <td className="px-3 py-2 border-y">
            <div className="h-6 w-[70%] animate-pulse bg-skeleton-foreground" />
          </td>
          <td className="border-y">
            <div className="flex items-center gap-1">
              <div className="h-6 w-[70%] animate-pulse bg-skeleton-foreground" />
            </div>
          </td>
          <td
            className="px-1 py-2 border-y"
            align="right">
            <div className="h-6 w-[80%] animate-pulse bg-skeleton-foreground" />
          </td>
          <td className="px-1 py-2 border-y">
            <div className="h-6 w-full animate-pulse bg-skeleton-foreground" />
          </td>
        </tr>
      ))}
      <tr>
        <td
          colSpan={4}
          className="p-0">
          <div className="list-skeleton-gradient h-6 w-full" />
        </td>
      </tr>
    </tbody>
  );
}
