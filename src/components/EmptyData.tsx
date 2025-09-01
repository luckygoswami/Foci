import { useEffect, useState } from 'react';

export function EmptyData({
  type,
}: {
  type: 'users' | 'groups' | 'requests' | 'invites';
}) {
  const [searchButton, setSearchButton] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setSearchButton(document.getElementById('search-button'));
  }, []);

  const variants = {
    users: {
      message: "It's just you and the void.",
      CTA: 'Find buddies',
    },
    groups: {
      message: "You're not in any squads yet.",
      CTA: 'Join a Group',
    },
    requests: {
      message: "Nobody's knocking on your door right now.",
      CTA: 'Invite buddies',
    },
    invites: {
      message: "Nobody's sent you an invite — yet 👀",
      CTA: 'Explore groups',
    },
  };

  const variant = variants[type];

  return (
    <div className="h-[500px] flex flex-col justify-center items-center gap-5">
      <p className="text-muted-foreground/80 font-medium text-center">
        {variant.message}
      </p>
      <button
        onClick={() => searchButton?.click()}
        className="px-3 py-2 rounded-lg bg-primary/90 text-primary-foreground">
        {variant.CTA}
      </button>
    </div>
  );
}
