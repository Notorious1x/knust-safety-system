import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getNotifications, markNotificationRead } from '../utils/api'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const typeIcon = { sos: '🆘', broadcast: '📢', incident: '📋', safewalk: '🚶' }

export default function Notifications() {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const all = await getNotifications()
    const mine = all.filter(n => n.user_id === user.id || n.user_id === 'all' || (n.user_id === 'all-security' && user.role === 'security'))
    setNotifs(mine)
    setLoading(false)
  }

  useEffect(() => { load() }, [user.id])

  const markRead = async (n) => {
    if (n.read) return
    await markNotificationRead(n.id)
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
  }

  const markAll = async () => {
    const unread = notifs.filter(n => !n.read)
    await Promise.all(unread.map(n => markNotificationRead(n.id)))
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifs.filter(n => !n.read).length

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAll}>Mark all read</button>
          )}
        </div>
      </div>

      <div className="card">
        {notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`} onClick={() => markRead(n)}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{typeIcon[n.type] || '🔔'}</div>
              <div className="notif-content" style={{ flex: 1 }}>
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <div className="notif-time">{timeAgo(n.created_at)}</div>
              </div>
              <div className={`notif-dot ${n.read ? 'read' : ''}`} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
