import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBroadcasts, getUserAlerts } from '../utils/api'

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
const statusBadge = (status) => {
  const map = { pending: 'badge-orange', investigating: 'badge-yellow', resolved: 'badge-green', active: 'badge-blue' }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

export default function Alerts() {
  const { user } = useAuth()
  const [tab, setTab] = useState('broadcasts')
  const [broadcasts, setBroadcasts] = useState([])
  const [myAlerts, setMyAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBroadcasts(),
      getUserAlerts(user.id)
    ]).then(([b, a]) => {
      setBroadcasts(b)
      setMyAlerts(a)
    }).finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading alerts...</div>

  return (
    <div>
      <div className="page-header"><h1>Alerts</h1><p>Campus broadcasts and your personal alert history</p></div>

      <div className="tabs">
        <button className={`tab ${tab === 'broadcasts' ? 'active' : ''}`} onClick={() => setTab('broadcasts')}>
          📢 Campus Broadcasts {broadcasts.length > 0 && <span className="nav-badge" style={{ marginLeft: 6 }}>{broadcasts.length}</span>}
        </button>
        <button className={`tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>
          🆘 My SOS History
        </button>
      </div>

      {tab === 'broadcasts' && (
        broadcasts.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-icon">📢</div><h3>No broadcasts</h3><p>Campus-wide alerts will appear here</p></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {broadcasts.map(b => (
              <div key={b.id} className={`alert-item ${b.severity}`}>
                <div className="alert-header">
                  <div>
                    <div className="alert-name">{b.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>By {b.created_by_name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {severityBadge(b.severity)}
                    <span className="alert-time">{timeAgo(b.created_at)}</span>
                  </div>
                </div>
                <div className="alert-message">{b.message}</div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'my' && (
        myAlerts.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-icon">🛡️</div><h3>No SOS alerts yet</h3><p>Your triggered alerts will appear here</p></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myAlerts.map(a => (
              <div key={a.id} className={`alert-item ${a.severity}`}>
                <div className="alert-header">
                  <div className="alert-meta">
                    <span style={{ fontSize: 18 }}>🆘</span>
                    <div>
                      <div className="alert-name">{a.alert_type.charAt(0).toUpperCase() + a.alert_type.slice(1)} Emergency</div>
                      <span className="alert-time">{timeAgo(a.created_at)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {severityBadge(a.severity)}
                    {statusBadge(a.status)}
                  </div>
                </div>
                {a.message && <div className="alert-message">{a.message}</div>}
                {a.responder_name && (
                  <div style={{ fontSize: 12, color: '#68d391' }}>✅ Responded by: {a.responder_name}</div>
                )}
                <div className="alert-location">📍 {a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
