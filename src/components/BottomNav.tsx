import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart, User } from 'lucide-react';

const navItems = [
  { to: '/app', icon: <Home size={20} />, label: 'Home' },
  { to: '/app/groups', icon: <Users size={20} />, label: 'Groups' },
  { to: '/app/progress', icon: <BarChart size={20} />, label: 'Progress' },
  { to: '/app/profile', icon: <User size={20} />, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white shadow z-1">
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
