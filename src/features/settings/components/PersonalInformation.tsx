import type { UserData } from '@/types';
import { useState } from 'react';
import { BioUpdateDialog } from './PersonalInfoUpdateDialog';
import { useUserData } from '@/features/user';

export function PersonalInformation({
  name,
  email,
  username,
  bio,
}: Pick<UserData, 'name' | 'username' | 'email' | 'bio'>) {
  const { userData, setUserData } = useUserData();
  const { userId } = userData!;
  const [dialogOpen, setDialogOpen] = useState<'bio' | false>(false);

  function handleBioUpdate(newBio: string) {
    setUserData((prev) => {
      return {
        ...prev!,
        bio: newBio,
      };
    });
  }

  return (
    <>
      <div className="rounded-md bg-card shadow-sm p-5 text-foreground">
        <div className="px-2 mb-4">
          <h1 className="font-semibold text-2xl">Personal Information</h1>
          <p className="text-muted-foreground">Your account details</p>
        </div>
        <div className="divide-y-1 divide-muted">
          {/* Name */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Name</label>
            <p className="text-muted-foreground max-w-[65%] truncate">{name}</p>
          </div>

          {/* Username */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Username</label>
            <p className="text-muted-foreground max-w-[65%] truncate">
              @{username}
            </p>
          </div>

          {/* Email */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Email</label>
            <p className="text-muted-foreground max-w-[65%] truncate">
              {email}
            </p>
          </div>

          {/* Bio */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Bio</label>
            <div
              className="flex items-center text-muted-foreground max-w-[65%] truncate"
              onClick={() => setDialogOpen('bio')}>
              <p className="truncate w-full">
                {!bio ? (
                  <span className="italic text-base">No bio found!</span>
                ) : (
                  bio
                )}
              </p>
              <span className="text-2xl">&nbsp;&gt;</span>
            </div>
          </div>
        </div>
      </div>

      <BioUpdateDialog
        isOpen={dialogOpen == 'bio'}
        onClose={() => setDialogOpen(false)}
        currentBio={bio}
        onSuccess={handleBioUpdate}
        userId={userId}
      />
    </>
  );
}
