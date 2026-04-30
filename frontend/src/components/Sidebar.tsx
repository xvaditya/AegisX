import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/incidents', icon: 'security', label: 'Incidents' },
  { to: '/monitoring', icon: 'analytics', label: 'Monitoring' },
  { to: '/logs', icon: 'description', label: 'Logs' },
  { to: '/network', icon: 'lan', label: 'Network' },
  { to: '/automation', icon: 'terminal', label: 'Automation' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
  { to: '/terminal', icon: 'keyboard_command_key', label: 'Terminal' },
];

export function Sidebar() {
  return (
    <aside className="aegis-sidebar">
      <div className="aegis-sidebar__mark">AX</div>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `aegis-nav-item ${isActive ? 'is-active' : ''}`}>
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
