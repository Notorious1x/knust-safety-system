import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext.jsx'
import { updateUser } from '../utils/api'

function Toggle({ on, onToggle }) {
  return <button className={`toggle ${on ? 'on' : ''}`} onClick={onToggle} />
}

export default function Settings() {
  const { user, login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications_sos: true,
    notifications_incidents: true,
    notifications_broadcasts: true,
    location_sharing: true,
    mute_non_emergency: false,
    dark_mode: theme === 'dark',
  })
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState('')
  const [saved, setSaved] = useState(false)

  const toggle = (k) => {
    if (k === 'dark_mode') {
      toggleTheme()
      setSettings(s => ({ ...s, [k]: !s[k] }))
    } else {
      setSettings(s => ({ ...s, [k]: !s[k] }))
    }
  }

  const saveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const changePassword = async () => {
    if (pwd.next !== pwd.confirm) { setPwdMsg('Passwords do not match'); return }
    if (pwd.next.length < 6) { setPwdMsg('Password must be at least 6 characters'); return }
    try {
      await updateUser(user.id, { password: pwd.next })
      setPwdMsg('Password updated successfully!')
      setPwd({ current: '', next: '', confirm: '' })
    } catch {
      setPwdMsg('Failed to update password')
    }
    setTimeout(() => setPwdMsg(''), 3000)
  }

  const Section = ({ title, children }) => (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="section-header" style={{ marginBottom: 0 }}><h3>{title}</h3></div>
      <div className="divider" />
      {children}
    </div>
  )

  return (
    <div>
      <div className="page-header"><h1>Settings</h1><p>Manage your preferences and privacy</p></div>

      {saved && (
        <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#68d391' }}>✅ Settings saved</div>
      )}

      <Section title="🔔 Notification Preferences">
        <div className="toggle-row">
          <div className="toggle-info"><h4>SOS Alerts</h4><p>Get notified when your SOS alert status changes</p></div>
          <Toggle on={settings.notifications_sos} onToggle={() => toggle('notifications_sos')} />
        </div>
        <div className="toggle-row">
          <div className="toggle-info"><h4>Incident Updates</h4><p>Notifications about your incident reports</p></div>
          <Toggle on={settings.notifications_incidents} onToggle={() => toggle('notifications_incidents')} />
        </div>
        <div className="toggle-row">
          <div className="toggle-info"><h4>Campus Broadcasts</h4><p>Campus-wide safety announcements</p></div>
          <Toggle on={settings.notifications_broadcasts} onToggle={() => toggle('notifications_broadcasts')} />
        </div>
        <div className="toggle-row">
          <div className="toggle-info"><h4>Mute Non-Emergency</h4><p>Only receive critical and high severity alerts</p></div>
          <Toggle on={settings.mute_non_emergency} onToggle={() => toggle('mute_non_emergency')} />
        </div>
      </Section>

      <Section title="📍 Location & Privacy">
        <div className="toggle-row">
          <div className="toggle-info"><h4>Location Sharing</h4><p>Allow sharing your location during SOS and Safe Walk</p></div>
          <Toggle on={settings.location_sharing} onToggle={() => toggle('location_sharing')} />
        </div>
        <div className="toggle-row">
          <div className="toggle-info"><h4>Dark Mode</h4><p>Use dark theme (recommended for night)</p></div>
          <Toggle on={settings.dark_mode} onToggle={() => toggle('dark_mode')} />
        </div>
      </Section>

      {user.role === 'security' && (
        <Section title="🛡️ Security Dashboard Settings">
          <div className="toggle-row">
            <div className="toggle-info"><h4>Auto-prioritize Alerts</h4><p>Automatically sort alerts by severity</p></div>
            <Toggle on={true} onToggle={() => {}} />
          </div>
          <div className="toggle-row">
            <div className="toggle-info"><h4>Sound Alerts</h4><p>Play sound for new SOS alerts</p></div>
            <Toggle on={true} onToggle={() => {}} />
          </div>
        </Section>
      )}

      <Section title="🔑 Change Password">
        <div style={{ padding: '8px 0' }}>
          {pwdMsg && (
            <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13, background: pwdMsg.includes('success') ? 'rgba(56,161,105,0.1)' : 'var(--red-glow)', color: pwdMsg.includes('success') ? '#68d391' : '#fc8181' }}>{pwdMsg}</div>
          )}
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" placeholder="Repeat new password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          </div>
          <button className="btn btn-secondary" onClick={changePassword}>Update Password</button>
        </div>
      </Section>

      <button className="btn btn-primary" onClick={saveSettings}>Save Settings</button>
    </div>
  )
}
