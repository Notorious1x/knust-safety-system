import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAlerts, getIncidents, getSafeWalks, getUsers, updateAlert } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SecurityDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [incidents, setIncidents] = useState([])
  const [safeWalks, setSafeWalks] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const load = async () => {
    const [a, i, s, u] = await Promise.all([getAlerts(), getIncidents(), getSafeWalks(), getUsers()])
    setAlerts(a); setIncidents(i); setSafeWalks(s); setUserCount(u.length)
    setLoading(false)
  }

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, 10000)
    return () => clearInterval(timerRef.current)
  }, [])

  const pending = alerts.filter(a => a.status === 'pending').length
  const activeWalks = safeWalks.filter(s => s.status === 'active').length
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading dashboard...</div>

  const statCards = [
    { label: 'Pending Alerts', value: pending, color: '#dc2626', icon: '🚨', to: '/security/alerts' },
    { label: 'Active Walks', value: activeWalks, color: '#16a34a', icon: '🚶', to: '/security/safe-walks' },
    { label: 'Open Incidents', value: openIncidents, color: '#ea580c', icon: '📋', to: '/security/incidents' },
    { label: 'Total Users', value: userCount, color: '#2563eb', icon: '👤', to: '/security/users' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            Security Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Real-time campus safety monitoring</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>Live</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {statCards.map(s => (
          <button key={s.label} className="stat-card" style={{ cursor: 'pointer', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--bg)' }} onClick={() => navigate(s.to)}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Active Safe Walks */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontWeight: 600, fontSize: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><circle cx="13" cy="4" r="1"/><path d="M7 21l2-6 2 2 4-8"/><path d="M11 15l-2 6"/></svg>
            Active Safe Walk Sessions
          </div>
          {safeWalks.filter(s => s.status === 'active').length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No active sessions</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {safeWalks.filter(s => s.status === 'active').map(w => (
                <div key={w.id} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{w.user_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>→ {w.destination} · {timeAgo(w.created_at)}</div>
                  </div>
                  <span className="badge badge-green">active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Incidents */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontWeight: 600, fontSize: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Recent Incidents
          </div>
          {incidents.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No incidents reported</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {incidents.slice(0, 5).map((inc, i) => (
                <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < Math.min(incidents.length, 5) - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{inc.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{inc.user_name}</div>
                  </div>
                  <span className={`badge ${inc.status === 'resolved' ? 'badge-green' : inc.status === 'investigating' ? 'badge-yellow' : 'badge-orange'}`}>{inc.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
