import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart, UserCog, Handshake } from 'lucide-react';

const navItems = [
  { to: '/app', icon: <Home size={20} />, label: 'Home' },
  { to: '/app/progress', icon: <BarChart size={20} />, label: 'Progress' },
  { to: '/app/groups', icon: <Users size={20} />, label: 'Groups' },
  { to: '/app/buddies', icon: <Handshake size={20} />, label: 'Buddies' },
  { to: '/app/account', icon: <UserCog size={20} />, label: 'Account' },
];

export default function BottomNav() {
  return (
    <nav className="border-t bg-white shadow z-10">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }>
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
