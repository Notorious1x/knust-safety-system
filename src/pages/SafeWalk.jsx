import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { createSafeWalk, updateSafeWalk, getUserSafeWalks, getGuardians, getCurrentPosition, createNotification } from '../utils/api'

function timeLeft(deadline) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const mins = Math.floor(diff / 60000)
  return `${mins}m remaining`
}

function MapView({ lat, lng }) {
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    if (!window.L) return
    const map = window.L.map(ref.current).setView([lat || 6.6745, lng || -1.5716], 16)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
    const icon = window.L.divIcon({ html: '<div style="background:#e53e3e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(229,62,62,0.6)"></div>', iconSize: [16, 16], iconAnchor: [8, 8], className: '' })
    window.L.marker([lat || 6.6745, lng || -1.5716], { icon }).addTo(map).bindPopup('Your location').openPopup()
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (mapRef.current && lat && lng) {
      mapRef.current.setView([lat, lng])
    }
  }, [lat, lng])

  return <div ref={ref} className="map-container" />
}

export default function SafeWalk() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [guardians, setGuardians] = useState([])
  const [active, setActive] = useState(null)
  const [form, setForm] = useState({ destination: '', duration: 30, selected_guardians: [] })
  const [loading, setLoading] = useState(false)
  const [pos, setPos] = useState(null)
  const [tab, setTab] = useState('active')

  useEffect(() => {
    if (user.role === 'student') {
      getUserSafeWalks(user.id).then(s => {
        setSessions(s)
        setActive(s.find(x => x.status === 'active') || null)
      })
      getGuardians(user.id).then(setGuardians)
    }
    getCurrentPosition().then(setPos).catch(() => {})
  }, [user.id])

  const startWalk = async () => {
    setLoading(true)
    try {
      const location = pos || { latitude: 6.6745, longitude: -1.5716 }
      const session = await createSafeWalk({
        user_id: user.id,
        user_name: user.full_name,
        destination: form.destination,
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'active',
        shared_with: form.selected_guardians,
        checkin_deadline: new Date(Date.now() + form.duration * 60000).toISOString()
      })
      for (const gId of form.selected_guardians) {
        await createNotification({ user_id: gId, title: 'Safe Walk Started', message: `${user.full_name} started walking to ${form.destination}`, type: 'safewalk' })
      }
      setActive(session)
      setSessions(s => [session, ...s])
    } catch (err) {
      alert('Failed to start Safe Walk')
    } finally {
      setLoading(false)
    }
  }

  const checkIn = async () => {
    if (!active) return
    await updateSafeWalk(active.id, { status: 'completed' })
    for (const gId of (active.shared_with || [])) {
      await createNotification({ user_id: gId, title: 'Safe Arrival ✅', message: `${user.full_name} has checked in safely at ${active.destination}`, type: 'safewalk' })
    }
    setActive(null)
    setSessions(s => s.map(x => x.id === active.id ? { ...x, status: 'completed' } : x))
  }

  const toggleGuardian = (id) => {
    setForm(f => ({
      ...f,
      selected_guardians: f.selected_guardians.includes(id)
        ? f.selected_guardians.filter(g => g !== id)
        : [...f.selected_guardians, id]
    }))
  }

  if (user.role === 'guardian') {
    return (
      <div>
        <div className="page-header"><h1>Safe Walk Monitor</h1><p>Track your students' safe walk sessions</p></div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🚶</div>
            <h3>No active Safe Walk sessions</h3>
            <p>You'll receive a notification when a student starts a walk</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header"><h1>Safe Walk</h1><p>Share your live location with guardians during your walk</p></div>

      {active ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#68d391' }}>🚶 Active Safe Walk</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>Destination: <strong>{active.destination}</strong></div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{timeLeft(active.checkin_deadline)}</div>
              </div>
              <button className="btn btn-green" onClick={checkIn}>✅ Check In (Arrived Safely)</button>
            </div>
          </div>

          <MapView lat={pos?.latitude} lng={pos?.longitude} />

          <div className="card">
            <div className="section-header"><h3>Session Info</h3></div>
            <div className="info-row"><span className="info-label">Destination</span><span className="info-value">{active.destination}</span></div>
            <div className="info-row"><span className="info-label">Time Left</span><span className="info-value">{timeLeft(active.checkin_deadline)}</span></div>
            <div className="info-row"><span className="info-label">Guardians Notified</span><span className="info-value">{active.shared_with?.length || 0}</span></div>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          <div className="card">
            <div className="section-header"><h3>Start a Safe Walk</h3></div>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <input className="form-input" placeholder="e.g. Unity Hall, Library..." value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <select className="form-select" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))}>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            {guardians.length > 0 && (
              <div className="form-group">
                <label className="form-label">Share with Guardians</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {guardians.map(g => (
                    <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, border: `1px solid ${form.selected_guardians.includes(g.guardian_user_id || g.id) ? 'var(--green)' : 'var(--border)'}` }}>
                      <input type="checkbox" checked={form.selected_guardians.includes(g.guardian_user_id || g.id)} onChange={() => toggleGuardian(g.guardian_user_id || g.id)} />
                      <span style={{ fontSize: 13 }}>{g.name} <span style={{ color: 'var(--text3)' }}>({g.relationship})</span></span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-green btn-full" disabled={loading || !form.destination} onClick={startWalk}>
              {loading ? 'Starting...' : '🚶 Start Safe Walk'}
            </button>
          </div>

          <div className="card">
            <div className="section-header"><h3>Walk History</h3></div>
            {sessions.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🚶</div><p>No walks yet</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sessions.map(s => (
                  <div key={s.id} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{s.destination}</span>
                      <span className={`badge ${s.status === 'completed' ? 'badge-green' : s.status === 'active' ? 'badge-blue' : 'badge-orange'}`}>{s.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
