import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { createAlert, getCurrentPosition, createNotification, getUserAlerts } from '../utils/api'

function MapWidget({ lat, lng }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  useEffect(() => {
    if (!ref.current || mapRef.current || !window.L) return
    const map = window.L.map(ref.current).setView([lat || 6.6745, lng || -1.5716], 16)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map)
    const icon = window.L.divIcon({ html: '<div style="background:#dc2626;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(220,38,38,0.5)"></div>', iconSize: [14,14], iconAnchor: [7,7], className: '' })
    window.L.marker([lat || 6.6745, lng || -1.5716], { icon }).addTo(map).bindPopup('Current Location').openPopup()
    mapRef.current = map
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [])
  return <div ref={ref} className="map-container" />
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SOSPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [pos, setPos] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    getCurrentPosition().then(setPos).catch(() => {})
    getUserAlerts(user.id).then(setAlerts).catch(() => {})
  }, [user.id])

  const handleSOS = async () => {
    if (loading) return
    setLoading(true)
    try {
      const location = pos || { latitude: 6.6745, longitude: -1.5716 }
      const alert = await createAlert({
        user_id: user.id, user_name: user.full_name,
        user_phone: user.phone, alert_type: 'emergency',
        severity: 'critical', latitude: location.latitude,
        longitude: location.longitude, message: '', status: 'pending'
      })
      await createNotification({ user_id: 'all-security', title: '🚨 New SOS Alert', message: `${user.full_name} triggered an emergency alert`, type: 'sos' })
      setAlerts(prev => [alert, ...prev])
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      alert('Failed to send SOS. Please call security directly.')
    } finally { setLoading(false) }
  }

  const statusColor = { pending: '#dc2626', investigating: '#2563eb', resolved: '#16a34a' }

  return (
    <div>
      <div className="page-header">
        <h1>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Emergency SOS
        </h1>
        <p>Tap the button below to send an emergency alert with your location</p>
      </div>

      {/* Hotline */}
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)' }}>KNUST Security Hotline</div>
          <a href="tel:0501347350" style={{ fontWeight: 800, color: '#dc2626', fontSize: 15 }}>0501347350</a>
        </div>
      </div>

      {sent && (
        <div className="alert-banner success" style={{ marginBottom: 16 }}>
          <span>✅ Alert sent! Campus security has been notified with your location.</span>
        </div>
      )}

      {/* SOS Button */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sos-btn-wrap">
          <button className="sos-btn" onClick={handleSOS} disabled={loading}>
            <div className="sos-ring" />
            {loading ? (
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="sos-btn-text">SOS</span>
                <span className="sos-btn-sub">TAP FOR HELP</span>
              </>
            )}
          </button>
          <p style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>
            Your GPS coordinates will be captured and sent to campus security immediately.
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Your Current Location
        </div>
        <MapWidget lat={pos?.latitude} lng={pos?.longitude} />
      </div>

      {/* Alert History */}
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Your Alert History</div>
        {alerts.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No alerts sent yet. Stay safe.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {alerts.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < alerts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[a.status] || '#6b7280', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{a.alert_type} Alert</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'capitalize' }}>{a.status}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(a.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
