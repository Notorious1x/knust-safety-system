import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getBroadcasts, createBroadcast, deleteBroadcast, createNotification } from '../../utils/api'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SecurityBroadcast() {
  const { user } = useAuth()
  const [broadcasts, setBroadcasts] = useState([])
  const [form, setForm] = useState({ title: '', message: '', severity: 'medium' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => { getBroadcasts().then(setBroadcasts) }, [])

  const send = async () => {
    if (!form.title || !form.message) return
    setLoading(true)
    try {
      const b = await createBroadcast({ created_by: user.id, created_by_name: user.full_name, title: form.title, message: form.message, severity: form.severity })
      await createNotification({ user_id: 'all', title: form.title, message: form.message, type: 'broadcast' })
      setBroadcasts(prev => [b, ...prev])
      setForm({ title: '', message: '', severity: 'medium' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally { setLoading(false) }
  }

  const remove = async (id) => {
    await deleteBroadcast(id)
    setBroadcasts(prev => prev.filter(b => b.id !== id))
  }

  const severityColors = { critical: 'badge-red', high: 'badge-orange', medium: 'badge-yellow', low: 'badge-green' }

  return (
    <div>
      <div className="page-header"><h1>Broadcast Alerts</h1><p>Send campus-wide safety announcements to all users</p></div>

      <div className="grid-2">
        <div className="card">
          <div className="section-header"><h3>📣 New Broadcast</h3></div>

          {success && <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#68d391', marginBottom: 16 }}>✅ Broadcast sent to all users!</div>}

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Alert title..." value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Severity Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['critical','🔴'],['high','🟠'],['medium','🟡'],['low','🟢']].map(([s, icon]) => (
                <button key={s} type="button"
                  onClick={() => set('severity', s)}
                  style={{ padding: '8px', border: `2px solid ${form.severity === s ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, background: form.severity === s ? 'var(--red-glow)' : 'var(--bg3)', color: form.severity === s ? 'var(--red)' : 'var(--text2)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  {icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea className="form-textarea" rows={5} placeholder="Type your campus alert message..." value={form.message} onChange={e => set('message', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading || !form.title || !form.message} onClick={send}>
            {loading ? 'Sending...' : '📣 Send Broadcast'}
          </button>
        </div>

        <div className="card">
          <div className="section-header"><h3>📜 Broadcast History</h3></div>
          {broadcasts.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📢</div><p>No broadcasts yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 500, overflowY: 'auto' }}>
              {broadcasts.map(b => (
                <div key={b.id} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${b.severity === 'critical' ? 'var(--red)' : b.severity === 'high' ? 'var(--orange)' : b.severity === 'medium' ? 'var(--yellow)' : 'var(--green)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{b.title}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className={`badge ${severityColors[b.severity]}`}>{b.severity}</span>
                      <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => remove(b.id)}>✕</button>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 6 }}>{b.message}</p>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(b.created_at)} · By {b.created_by_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
