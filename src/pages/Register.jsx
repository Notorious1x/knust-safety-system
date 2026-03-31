import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createUser, validateSecurityId, claimSecurityId, getUsers } from '../utils/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', student_id: '', role: 'student', security_code: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const users = await getUsers()
      if (users.find(u => u.email === form.email)) throw new Error('Email already registered')
      if (form.role === 'security') {
        const v = await validateSecurityId(form.security_code)
        if (!v.valid) throw new Error(v.error)
        await claimSecurityId(v.record.id)
      }
      const newUser = await createUser({ full_name: form.full_name, email: form.email, password: form.password, phone: form.phone, student_id: form.role === 'student' ? form.student_id : undefined, role: form.role, created_at: new Date().toISOString() })
      login(newUser); navigate('/dashboard')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>CampusGuard</span>
        </div>
        <h1>Create account</h1>
        <p className="auth-sub">Join the KNUST campus safety network</p>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select className="form-select" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="student">Student</option>
              <option value="guardian">Guardian / Trusted Contact</option>
              <option value="security">Security Personnel</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="John Doe" value={form.full_name} onChange={e => set('full_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="024XXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          {form.role === 'student' && (
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input className="form-input" placeholder="20XXXXXXX" value={form.student_id} onChange={e => set('student_id', e.target.value)} />
            </div>
          )}
          {form.role === 'security' && (
            <div className="form-group">
              <label className="form-label">Security ID Code *</label>
              <input className="form-input" placeholder="KNSxxxxxx" value={form.security_code} onChange={e => set('security_code', e.target.value)} required />
              <span style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>Use: KNS123456 or KNS789012</span>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} minLength={6} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Log In</Link></div>
      </div>
    </div>
  )
}
