import type { GroupMember } from '@/types';
import { getGroupRoles } from '../services/groups';

const creatorBg = 'a7c7e7';
const adminsBg = ['a8e6cf', 'ffb7b2', 'c3b1e1', 'fff5ba'];
const membersBg = ['ffd1ba', 'b7efc5', 'b5bad0', 'b2f7ef', 'ffd6d6'];

export function GroupMembersList({ members }: { members: GroupMember[] }) {
  const {
    creator,
    admins: adminsList,
    members: membersList,
  } = getGroupRoles(members);

  return (
    <ol className="members-list h-5/12 overflow-scroll borde border-blue-500 py-2">
      {/* creator */}
      <li className="flex items-center mb-3">
        <div
          className={`rounded-full size-11 overflow-hidden flex items-center justify-center mr-3`}
          style={{ backgroundColor: `#${creatorBg}` }}>
          <img
            src={`/assets/avatars/${creator.avatarId}.svg`}
            alt={`${creator.name}_avatar`}
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-[17px] text-black leading-5">
            {creator.name}
          </div>
          <div className="text-[15px] text-gray-500 -mt-1">creator</div>
        </div>
      </li>

      {/* admins */}
      {adminsList.map((admin, i) => (
        <li
          key={`${admin.name}-${i}`}
          className="flex items-center mb-3">
          <div
            className={`rounded-full size-11 overflow-hidden flex items-center justify-center mr-3`}
            style={{ backgroundColor: `#${adminsBg[i % adminsBg.length]}` }}>
            <img
              src={`/assets/avatars/${admin.avatarId}.svg`}
              alt={`${admin.name}_avatar`}
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-[17px] text-black leading-5">
              {admin.name}
            </div>
            <div className="text-[15px] text-gray-500 -mt-1">admin</div>
          </div>
        </li>
      ))}

      {/* members */}
      {membersList.map((member, i) => (
        <li
          key={`${member.name}-${i}`}
          className="flex items-center mb-3">
          <div
            className={`rounded-full size-11 overflow-hidden flex items-center justify-center mr-3`}
            style={{ backgroundColor: `#${membersBg[i % membersBg.length]}` }}>
            <img
              src={`/assets/avatars/${member.avatarId}.svg`}
              alt={`${member.name}_avatar`}
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-[17px] text-black leading-5">
              {member.name}
            </div>
            <div className="text-[15px] text-gray-500 -mt-1">member</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
