import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../utils/api'

export default function Profile() {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: user.full_name, phone: user.phone || '', student_id: user.student_id || '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      await updateUser(user.id, form)
      login({ ...user, ...form })
      setMsg('Profile updated!')
      setEditing(false)
    } catch { setMsg('Failed to save') }
    finally { setSaving(false); setTimeout(() => setMsg(''), 2000) }
  }

  const initials = user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const roleLabel = { student: '🎓 Student', guardian: '👥 Guardian', security: '🛡️ Security Personnel' }
  const roleColor = { student: 'var(--red)', guardian: 'var(--green)', security: 'var(--blue)' }

  return (
    <div>
      <div className="page-header"><h1>Profile</h1><p>Manage your account information</p></div>

      {msg && <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#68d391' }}>{msg}</div>}

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg4)', border: `3px solid ${roleColor[user.role]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: roleColor[user.role], fontFamily: 'var(--font-head)' }}>
            {initials}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>{user.full_name}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{user.email}</div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-blue">{roleLabel[user.role]}</span>
            </div>
          </div>
          <div style={{ width: '100%', background: 'var(--bg3)', borderRadius: 8, padding: '14px' }}>
            <div className="info-row"><span className="info-label">Member since</span><span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span></div>
            {user.student_id && <div className="info-row"><span className="info-label">Student ID</span><span className="info-value">{user.student_id}</span></div>}
            {user.phone && <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{user.phone}</span></div>}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h3>Account Details</h3>
            {!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>}
          </div>

          {editing ? (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              {user.role === 'student' && (
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input className="form-input" value={form.student_id} onChange={e => set('student_id', e.target.value)} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="info-row"><span className="info-label">Full Name</span><span className="info-value">{user.full_name}</span></div>
              <div className="info-row"><span className="info-label">Email</span><span className="info-value">{user.email}</span></div>
              <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{user.phone || '—'}</span></div>
              <div className="info-row"><span className="info-label">Role</span><span className="info-value">{roleLabel[user.role]}</span></div>
              {user.student_id && <div className="info-row"><span className="info-label">Student ID</span><span className="info-value">{user.student_id}</span></div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
