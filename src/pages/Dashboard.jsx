import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserAlerts, getBroadcasts, getUserSafeWalks, getGuardians, getCurrentPosition } from '../utils/api'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function MapWidget({ lat, lng }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  useEffect(() => {
    if (!ref.current || mapRef.current || !window.L) return
    const map = window.L.map(ref.current, { zoomControl: true }).setView([lat || 6.6745, lng || -1.5716], 16)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map)
    const icon = window.L.divIcon({
      html: '<div style="background:#dc2626;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(220,38,38,0.5)"></div>',
      iconSize: [14, 14], iconAnchor: [7, 7], className: ''
    })
    window.L.marker([lat || 6.6745, lng || -1.5716], { icon }).addTo(map).bindPopup('Current Location').openPopup()
    mapRef.current = map
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [])
  return <div ref={ref} className="map-container" />
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [safeWalks, setSafeWalks] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  const [guardianCount, setGuardianCount] = useState(0)
  const [pos, setPos] = useState(null)
  const [loadingPos, setLoadingPos] = useState(true)

  useEffect(() => {
    getUserAlerts(user.id).then(setAlerts).catch(() => {})
    getUserSafeWalks(user.id).then(setSafeWalks).catch(() => {})
    getBroadcasts().then(d => setBroadcasts(d.slice(0, 3))).catch(() => {})
    getGuardians(user.id).then(g => setGuardianCount(g.length)).catch(() => {})
    getCurrentPosition().then(p => { setPos(p); setLoadingPos(false) }).catch(() => setLoadingPos(false))
  }, [user.id])

  const activeAlerts = alerts.filter(a => a.status !== 'resolved').length
  const activeWalks = safeWalks.filter(s => s.status === 'active').length

  const quickActions = [
    { href: '/sos', label: 'SOS', desc: 'Emergency alert', color: '#dc2626', bg: '#fef2f2', icon: '🚨' },
    { href: '/safe-walk', label: 'Safe Walk', desc: 'Share location', color: '#16a34a', bg: '#f0fdf4', icon: '🚶' },
    { href: '/report', label: 'Report', desc: 'File incident', color: '#ea580c', bg: '#fff7ed', icon: '📋' },
    { href: '/guardians', label: 'Guardians', desc: `${guardianCount} contacts`, color: '#9333ea', bg: '#faf5ff', icon: '👥' },
  ]

  const sevColor = { critical: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#16a34a' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Welcome back, {user?.full_name?.split(' ')[0]}</p>
        </div>
      </div>

      {/* Security hotline banner */}
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)' }}>KNUST Security Hotline</div>
            <a href="tel:0501347350" style={{ fontSize: 16, fontWeight: 800, color: '#dc2626', textDecoration: 'none' }}>0501347350</a>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/sos')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          SOS
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid-4" style={{ marginBottom: 12 }}>
        {quickActions.map(a => (
          <button key={a.href} className="quick-action-card" onClick={() => navigate(a.href)}>
            <div className="action-icon" style={{ background: a.bg }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
            </div>
            <div className="action-label">{a.label}</div>
            <div className="action-desc">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="stat-card"><div className="stat-value" style={{ color: '#dc2626' }}>{activeAlerts}</div><div className="stat-label">Active Alerts</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#16a34a' }}>{activeWalks}</div><div className="stat-label">Active Walks</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#2563eb' }}>{alerts.length}</div><div className="stat-label">Total Alerts</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#9333ea' }}>{guardianCount}</div><div className="stat-label">Guardians</div></div>
      </div>

      {/* Map */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontWeight: 600, fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Your Location
        </div>
        {loadingPos ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', gap: 8 }}>
            <div className="spinner" /> Getting location...
          </div>
        ) : <MapWidget lat={pos?.latitude} lng={pos?.longitude} />}
      </div>

      {/* Campus Broadcasts */}
      {broadcasts.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
              Campus Alerts
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/alerts')}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {broadcasts.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"/></svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{timeAgo(b.created_at)}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, background: b.severity === 'critical' ? '#dc2626' : b.severity === 'high' ? '#ea580c' : b.severity === 'medium' ? '#ca8a04' : '#2563eb', color: 'white', flexShrink: 0 }}>{b.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent alert history */}
      {alerts.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Recent Alert History</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {alerts.slice(0, 5).map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < Math.min(alerts.length, 5) - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'pending' ? '#dc2626' : a.status === 'investigating' ? '#2563eb' : '#16a34a', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{a.alert_type}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'capitalize' }}>{a.status}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(a.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
