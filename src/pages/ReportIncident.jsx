import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createIncident, getCurrentPosition, createNotification } from '../utils/api'

export default function ReportIncident() {
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', location_description: '', image_url: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const pos = await getCurrentPosition()
      await createIncident({
        user_id: user.id,
        user_name: user.full_name,
        title: form.title,
        description: form.description,
        severity: form.severity,
        location_description: form.location_description,
        latitude: pos.latitude,
        longitude: pos.longitude,
        image_url: form.image_url || '',
        status: 'pending'
      })
      await createNotification({ user_id: 'all-security', title: 'New Incident Report', message: `${user.full_name} reported: ${form.title}`, type: 'incident' })
      setSuccess(true)
      setForm({ title: '', description: '', severity: 'medium', location_description: '', image_url: '' })
    } catch (err) {
      setError('Failed to submit report. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header"><h1>Report Incident</h1><p>Report suspicious activities or safety concerns to campus security</p></div>

      {success && (
        <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>✅</span>
          <span style={{ fontSize: 14, color: '#68d391', fontWeight: 600 }}>Report submitted successfully! Security will review it shortly.</span>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--red-glow)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fc8181', marginBottom: 16 }}>{error}</div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="section-header"><h3>Incident Details</h3></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Incident Title *</label>
              <input className="form-input" placeholder="Brief title of the incident" value={form.title} onChange={e => set('title', e.target.value)} required />
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
              <label className="form-label">Location Description</label>
              <input className="form-input" placeholder="e.g. Near Main Gate, SRC Building..." value={form.location_description} onChange={e => set('location_description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Full Description *</label>
              <textarea className="form-textarea" rows={5} placeholder="Describe what happened in detail..." value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input className="form-input" placeholder="Paste an image URL if available" value={form.image_url} onChange={e => set('image_url', e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : '📋 Submit Report'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-header"><h3>What to Report</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['🚨', 'Suspicious persons or vehicles'],['⚔️', 'Physical altercations or threats'],['🔓', 'Unauthorized access to buildings'],['💡', 'Broken lights or safety hazards'],['🚗', 'Dangerous driving on campus'],['📦', 'Abandoned packages or items']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text2)' }}>
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--red-glow)', border: '1px solid rgba(229,62,62,0.25)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fc8181', marginBottom: 8 }}>⚠️ Life-threatening emergency?</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Don't use this form. Use the SOS button immediately!</p>
            <a href="/sos" className="btn btn-primary btn-sm">🆘 Go to SOS</a>
          </div>

          <div className="card">
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>📍 Your GPS location will be automatically attached to this report.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
