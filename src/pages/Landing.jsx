import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '🚨', title: 'One-Tap SOS', desc: 'Trigger an emergency alert instantly. Your GPS location is captured and sent to campus security.' },
  { icon: '🚶', title: 'Safe Walk', desc: 'Share live location with guardians during late-night walks. Auto-check-in when you arrive.' },
  { icon: '🗺️', title: 'Live Tracking', desc: 'Real-time map monitoring for security personnel and guardians during emergencies.' },
  { icon: '📋', title: 'Incident Reporting', desc: 'Report suspicious activities with descriptions, images, and GPS-tagged locations.' },
  { icon: '👥', title: 'Guardian Alerts', desc: 'Trusted contacts receive real-time notifications during SOS and Safe Walk sessions.' },
  { icon: '📣', title: 'Alert Broadcasting', desc: 'Security can broadcast campus-wide safety alerts categorized by severity.' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          CampusGuard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="tel:0501347350" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            0501347350
          </a>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Campus Safety System
        </div>
        <h1>Stay Safe on<br /><span>KNUST Campus</span></h1>
        <p>CampusGuard is a web-based emergency alert system for KNUST students. One-tap SOS, live tracking, Safe Walk, incident reporting, and guardian alerts.</p>
        <div className="hero-btns">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Started →</button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </section>

      <section className="features-grid">
        {features.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feat-icon"><span style={{ fontSize: 28 }}>{f.icon}</span></div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>CampusGuard — KNUST Emergency Alert System</span>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>Security: <a href="tel:0501347350" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>0501347350</a></span>
      </footer>
    </div>
  )
}
