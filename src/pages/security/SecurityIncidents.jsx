import React, { useState, useEffect } from 'react'
import { getIncidents, updateIncident } from '../../utils/api'

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

export default function SecurityIncidents() {
  const [incidents, setIncidents] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIncidents().then(setIncidents).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    await updateIncident(id, { status })
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter)

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>

  return (
    <div>
      <div className="page-header"><h1>Incident Reports</h1><p>Manage and respond to reported incidents</p></div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'All'], ['pending', '⏳ Pending'], ['investigating', '🔍 Investigating'], ['resolved', '✅ Resolved']].map(([v, l]) => (
          <button key={v} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📋</div><h3>No incidents</h3><p>No {filter !== 'all' ? filter : ''} incidents found</p></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(i => (
            <div key={i.id} className={`alert-item ${i.severity}`}>
              <div className="alert-header">
                <div>
                  <div className="alert-name">{i.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Reported by {i.user_name} · {timeAgo(i.created_at)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {severityBadge(i.severity)}
                  <span className={`badge ${i.status === 'resolved' ? 'badge-green' : i.status === 'investigating' ? 'badge-yellow' : 'badge-orange'}`}>{i.status}</span>
                </div>
              </div>

              <div className="alert-message">{i.description}</div>

              {i.location_description && (
                <div className="alert-location">📍 {i.location_description}</div>
              )}

              {i.image_url && (
                <div>
                  <img src={i.image_url} alt="Incident" style={{ maxHeight: 180, borderRadius: 8, maxWidth: '100%' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}

              <div className="alert-actions">
                {i.status === 'pending' && (
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(i.id, 'investigating')}>🔍 Start Investigating</button>
                )}
                {i.status === 'investigating' && (
                  <button className="btn btn-green btn-sm" onClick={() => updateStatus(i.id, 'resolved')}>✅ Mark Resolved</button>
                )}
                {i.status === 'pending' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(i.id, 'resolved')}>✅ Resolve</button>
                )}
                {i.latitude && (
                  <a className="btn btn-ghost btn-sm" href={`https://www.google.com/maps?q=${i.latitude},${i.longitude}`} target="_blank" rel="noreferrer">🗺️ Map</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
