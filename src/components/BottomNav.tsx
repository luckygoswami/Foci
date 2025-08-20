import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart, UserCog, Handshake } from 'lucide-react';

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/progress', icon: BarChart, label: 'Progress' },
  { to: '/app/groups', icon: Users, label: 'Groups' },
  { to: '/app/buddies', icon: Handshake, label: 'Buddies' },
  { to: '/app/account', icon: UserCog, label: 'Account' },
];

export default function BottomNav() {
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
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
