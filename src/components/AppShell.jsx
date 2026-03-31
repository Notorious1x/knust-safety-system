import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const I = {
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  walk: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="1"/><path d="M7 21l2-6 2 2 4-8"/><path d="M11 15l-2 6"/><path d="M9 10l-2 2 2 1"/></svg>,
  sos: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  radio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  chevL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
}

function NavItem({ icon, label, to, badge, collapsed, onClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const active = to ? (to === '/dashboard' ? location.pathname === to : location.pathname.startsWith(to)) : false

  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={() => onClick ? onClick() : navigate(to)}
      title={collapsed ? label : ''}
    >
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span className="nav-label">{label}</span>}
      {!collapsed && badge > 0 && <span className="nav-badge">{badge}</span>}
    </button>
  )
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const studentNav = [
    { to: '/dashboard', icon: I.dashboard, label: 'Dashboard' },
    { to: '/safe-walk', icon: I.walk, label: 'Safe Walk' },
    { to: '/sos', icon: I.sos, label: 'SOS' },
    { to: '/report', icon: I.file, label: 'Report Incident' },
    { to: '/alerts', icon: I.radio, label: 'Alerts' },
    { to: '/guardians', icon: I.users, label: 'Guardians' },
    { to: '/notifications', icon: I.bell, label: 'Notifications' },
    { to: '/settings', icon: I.gear, label: 'Settings' },
    { to: '/profile', icon: I.user, label: 'Profile' },
  ]

  const securityNav = [
    { to: '/dashboard', icon: I.dashboard, label: 'Dashboard' },
    { to: '/security/alerts', icon: I.sos, label: 'SOS Alerts' },
    { to: '/security/safe-walks', icon: I.walk, label: 'Safe Walks' },
    { to: '/security/incidents', icon: I.file, label: 'Incidents' },
    { to: '/security/broadcast', icon: I.radio, label: 'Broadcast' },
    { to: '/security/users', icon: I.users, label: 'Users' },
    { to: '/notifications', icon: I.bell, label: 'Notifications' },
    { to: '/settings', icon: I.gear, label: 'Settings' },
  ]

  const guardianNav = [
    { to: '/dashboard', icon: I.dashboard, label: 'Dashboard' },
    { to: '/safe-walk', icon: I.map, label: 'Live Tracking' },
    { to: '/notifications', icon: I.bell, label: 'Notifications' },
    { to: '/settings', icon: I.gear, label: 'Settings' },
    { to: '/profile', icon: I.user, label: 'Profile' },
  ]

  const navItems = user?.role === 'security' ? securityNav : user?.role === 'guardian' ? guardianNav : studentNav
  const mobileItems = navItems.slice(0, 5)

  return (
    <div className="app-layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="logo-icon">{I.shield}</span>
          {!collapsed && <span className="logo-text">CampusGuard</span>}
        </div>

        {/* Collapse toggle */}
        <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? I.chevR : I.chevL}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="security-card">
              {I.phone}
              <div className="security-card-text">
                <div className="security-card-label">KNUST Security</div>
                <div className="security-card-num">0501347350</div>
              </div>
            </div>
          )}
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name">{user?.full_name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            )}
          </div>
          <NavItem icon={I.logout} label="Logout" collapsed={collapsed} onClick={() => { logout(); navigate('/') }} />
        </div>
      </aside>

      {/* Page content */}
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        {children}
      </main>

      {/* Mobile nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {mobileItems.map(item => (
            <button
              key={item.to}
              className={`mobile-nav-item ${location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to)) ? 'active' : ''}`}
              onClick={() => navigate(item.to)}
            >
              {item.icon}
              <span>{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
