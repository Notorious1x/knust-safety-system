import React, { useState, useEffect } from 'react'
import { getSafeWalks, updateSafeWalk } from '../../utils/api'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function SecuritySafeWalks() {
  const [walks, setWalks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSafeWalks().then(setWalks).finally(() => setLoading(false))
    const t = setInterval(() => getSafeWalks().then(setWalks), 10000)
    return () => clearInterval(t)
  }, [])

  const endSession = async (id) => {
    await updateSafeWalk(id, { status: 'completed' })
    setWalks(prev => prev.map(w => w.id === id ? { ...w, status: 'completed' } : w))
  }

  const active = walks.filter(w => w.status === 'active')
  const past = walks.filter(w => w.status !== 'active')

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <h1>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13" cy="4" r="1"/><path d="M7 21l2-6 2 2 4-8"/><path d="M11 15l-2 6"/></svg>
          Safe Walks
        </h1>
        <p>Monitor active student safe walk sessions</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', animation: 'sosPulse 2s infinite' }} />
        <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 500 }}>Live — {active.length} active session{active.length !== 1 ? 's' : ''}</span>
      </div>

      {active.length === 0 ? (
        <div className="card"><div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13" cy="4" r="1"/><path d="M7 21l2-6 2 2 4-8"/></svg>
          <h3>No active sessions</h3><p>Active safe walks will appear here</p>
        </div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {active.map(w => (
            <div key={w.id} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{w.user_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>→ {w.destination}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Started {timeAgo(w.created_at)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-green">Active</span>
                  <a className="btn btn-secondary btn-sm" href={`https://www.google.com/maps?q=${w.latitude},${w.longitude}`} target="_blank" rel="noreferrer">🗺️ Map</a>
                  <button className="btn btn-danger btn-sm" onClick={() => endSession(w.id)}>End Session</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Past Sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {past.slice(0, 10).map((w, i) => (
              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < past.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{w.user_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>→ {w.destination}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge ${w.status === 'completed' ? 'badge-green' : 'badge-gray'}`}>{w.status}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(w.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
