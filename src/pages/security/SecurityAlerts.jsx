import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAlerts, getAllAlerts, updateAlert } from '../../utils/api'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const severityBadge = (sev) => {
  const map = { critical: 'badge-red', high: 'badge-orange', medium: 'badge-yellow', low: 'badge-green' }
  return <span className={`badge ${map[sev] || 'badge-gray'}`}>{sev}</span>
}

export default function SecurityAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [tab, setTab] = useState('active')
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  const load = async () => {
    const data = await getAllAlerts()
    setAlerts(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 8000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const respond = async (id) => {
    await updateAlert(id, { status: 'investigating', responder_id: user.id, responder_name: user.full_name })
    load()
  }

  const resolve = async (id) => {
    await updateAlert(id, { status: 'resolved', archived: true, archived_at: new Date().toISOString() })
    load()
  }

  const active = alerts.filter(a => !a.archived && (a.status === 'pending' || a.status === 'investigating'))
  const resolved = alerts.filter(a => a.status === 'resolved')
  const shown = tab === 'active' ? active : resolved

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading alerts...</div>

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><h1>SOS Alerts</h1><p>Monitor and respond to student emergencies</p></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'sosPulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--green)' }}>Live</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
          🚨 Active {active.length > 0 && <span className="nav-badge" style={{ marginLeft: 6 }}>{active.length}</span>}
        </button>
        <button className={`tab ${tab === 'resolved' ? 'active' : ''}`} onClick={() => setTab('resolved')}>
          ✅ Resolved ({resolved.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">{tab === 'active' ? '🛡️' : '✅'}</div>
            <h3>{tab === 'active' ? 'No active alerts' : 'No resolved alerts'}</h3>
            <p>{tab === 'active' ? 'Campus is clear — stay vigilant' : 'Resolved alerts will appear here'}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map(a => (
            <div key={a.id} className={`alert-item ${a.severity}`}>
              <div className="alert-header">
                <div>
                  <div className="alert-name">{a.user_name}</div>
                  <div className="alert-meta" style={{ marginTop: 4 }}>
                    <span className="pill">{a.alert_type}</span>
                    {severityBadge(a.severity)}
                    <span className={`badge ${a.status === 'pending' ? 'badge-orange' : a.status === 'investigating' ? 'badge-blue' : 'badge-green'}`}>{a.status}</span>
                  </div>
                </div>
                <span className="alert-time">{timeAgo(a.created_at)}</span>
              </div>

              {a.user_phone && (
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>📞 {a.user_phone}</div>
              )}
              {a.message && <div className="alert-message">{a.message}</div>}
              <div className="alert-location">📍 {a.latitude?.toFixed(5)}, {a.longitude?.toFixed(5)}</div>

              {a.responder_name && (
                <div style={{ fontSize: 12, color: '#63b3ed' }}>🔍 Responding officer: {a.responder_name}</div>
              )}

              {tab === 'active' && (
                <div className="alert-actions">
                  {a.status === 'pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => respond(a.id)}>🚔 Respond</button>
                  )}
                  <button className="btn btn-green btn-sm" onClick={() => resolve(a.id)}>✅ Mark Resolved</button>
                  <a className="btn btn-secondary btn-sm" href={`https://www.google.com/maps?q=${a.latitude},${a.longitude}`} target="_blank" rel="noreferrer">🗺️ Open Map</a>
                  <a className="btn btn-ghost btn-sm" href={`tel:${a.user_phone}`}>📞 Call Student</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
