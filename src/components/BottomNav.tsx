import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart, Handshake } from 'lucide-react';
import { useUserData } from '@/features/user';

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/progress', icon: BarChart, label: 'Progress' },
  { to: '/app/groups', icon: Users, label: 'Groups' },
  { to: '/app/buddies', icon: Handshake, label: 'Buddies' },
];

export default function BottomNav() {
  const { userData } = useUserData();
  const { avatarId } = userData!;

  return (
    <nav className="border-t bg-white shadow z-10">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }>
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          key={'/app/account'}
          to={'/app/account'}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? 'text-primary' : 'text-gray-500'
            }`
          }>
          <img
            className="size-6 rounded-full"
            src={`/avatars/${avatarId}.svg`}
          />
          <span>Account</span>
        </NavLink>
      </div>
    </nav>
  );
}
