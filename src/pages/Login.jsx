import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../utils/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await loginUser(form.email, form.password)
      login(user); navigate('/dashboard')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const demos = [
    { label: '🎓 Student', email: 'student@knust.edu.gh', password: 'password123' },
    { label: '🛡️ Security', email: 'security@knust.edu.gh', password: 'security123' },
    { label: '👥 Guardian', email: 'guardian@gmail.com', password: 'guardian123' },
  ]

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>CampusGuard</span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to access your safety dashboard</p>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 4 }} type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Logging in...</> : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link></div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Demo accounts</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {demos.map(d => (
              <button key={d.label} className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 11 }}
                onClick={() => setForm({ email: d.email, password: d.password })}>{d.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
