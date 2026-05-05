import { NavLink } from 'react-router-dom'
import NowPlaying from './NowPlaying'
import { logout } from '../lib/auth'

const links = [
  { to: '/overview', label: 'Overview' },
  { to: '/personality', label: 'Personality' },
  { to: '/deep-dive', label: 'Deep Dive' },
]

export default function Sidebar({ user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <span className="sidebar-title">Favorites</span>
        <nav>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <NowPlaying />
        {user && (
          <div className="user-info">
            {user.images?.[0]?.url && (
              <img src={user.images[0].url} alt="" className="user-avatar" />
            )}
            <span className="user-name">{user.display_name}</span>
            <button className="logout-btn" onClick={() => { logout(); window.location.reload() }} title="Log out">
              ×
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
