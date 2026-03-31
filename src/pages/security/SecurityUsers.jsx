import React, { useState, useEffect } from 'react'
import { getUsers, updateUser, generateSecurityIds, getSecurityIds } from '../../utils/api'

function generateId() { return Math.random().toString(36).substring(2) + Date.now().toString(36) }
function generateCode() {
  const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
  return `KNS${digits}`
}

export default function SecurityUsers() {
  const [users, setUsers] = useState([])
  const [secIds, setSecIds] = useState([])
  const [tab, setTab] = useState('users')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState([])

  useEffect(() => {
    Promise.all([getUsers(), getSecurityIds()]).then(([u, s]) => {
      setUsers(u)
      setSecIds(s)
      setLoading(false)
    })
  }, [])

  const deactivate = async (id) => {
    await updateUser(id, { deactivated: true })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, deactivated: true } : u))
  }

  const activate = async (id) => {
    await updateUser(id, { deactivated: false })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, deactivated: false } : u))
  }

  const genNewIds = async () => {
    const codes = Array.from({ length: 5 }, () => ({ id: generateId(), code: generateCode(), used: false, created_at: new Date().toISOString() }))
    // Post each to db
    const results = await Promise.all(codes.map(c =>
      fetch('/api/security_ids', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }).then(r => r.json())
    ))
    setNewIds(results)
    setSecIds(prev => [...results, ...prev])
  }

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter)

  const roleColor = { student: 'badge-blue', guardian: 'badge-green', security: 'badge-orange' }
  const roleIcon = { student: '🎓', guardian: '👥', security: '🛡️' }

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>

  return (
    <div>
      <div className="page-header"><h1>User Management</h1><p>Manage registered users and security access</p></div>

      <div className="tabs">
        <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>👤 Users ({users.length})</button>
        <button className={`tab ${tab === 'ids' ? 'active' : ''}`} onClick={() => setTab('ids')}>🔑 Security IDs</button>
      </div>

      {tab === 'users' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[['all', 'All Users'], ['student', '🎓 Students'], ['guardian', '👥 Guardians'], ['security', '🛡️ Security']].map(([v, l]) => (
              <button key={v} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>

          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {filtered.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="user-avatar" style={{ width: 40, height: 40, flexShrink: 0 }}>
                    {u.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.full_name} {u.deactivated && <span className="badge badge-gray" style={{ marginLeft: 6 }}>Deactivated</span>}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{u.email} {u.student_id && `· ${u.student_id}`}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{u.phone}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${roleColor[u.role] || 'badge-gray'}`}>{roleIcon[u.role]} {u.role}</span>
                    {u.deactivated
                      ? <button className="btn btn-green btn-sm" onClick={() => activate(u.id)}>Activate</button>
                      : <button className="btn btn-danger btn-sm" onClick={() => deactivate(u.id)}>Deactivate</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'ids' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={genNewIds}>🔑 Generate 5 New Security IDs</button>
          </div>

          {newIds.length > 0 && (
            <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#68d391', marginBottom: 10 }}>✅ New Security IDs Generated:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {newIds.map(id => (
                  <span key={id.id} style={{ background: 'var(--bg3)', border: '1px solid var(--green)', borderRadius: 6, padding: '4px 12px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>{id.code}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {secIds.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < secIds.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: s.used ? 'var(--text3)' : 'var(--text)', letterSpacing: 1 }}>{s.code}</span>
                  <div style={{ flex: 1 }}>
                    {s.used && s.used_by_name && <span style={{ fontSize: 12, color: 'var(--text2)' }}>Used by {s.used_by_name}</span>}
                  </div>
                  <span className={`badge ${s.used ? 'badge-gray' : 'badge-green'}`}>{s.used ? 'Used' : 'Available'}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
