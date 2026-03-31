const BASE = '/api'

import { 
  mockUsers, mockSosAlerts, mockSafeWalks, mockIncidents, 
  mockBroadcasts, mockNotifications, mockContacts, mockGuardians, mockSecurityIds 
} from './mockData.js'

// Flag to use mock data (for deployed demo)
const USE_MOCK_DATA = !window.location.hostname.includes('localhost')

// Simulate network delay for realistic experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function req(path, options = {}) {
  if (USE_MOCK_DATA) {
    await delay(500) // Simulate network delay
    
    // Return mock data based on the endpoint
    if (path.includes('/users')) {
      if (options?.method === 'POST') {
        const newUser = JSON.parse(options.body)
        newUser.id = Math.random().toString(36).substring(2)
        return newUser
      }
      return mockUsers
    }
    if (path.includes('/sos_alerts')) return mockSosAlerts
    if (path.includes('/safe_walks')) return mockSafeWalks
    if (path.includes('/incidents')) return mockIncidents
    if (path.includes('/broadcasts')) return mockBroadcasts
    if (path.includes('/notifications')) return mockNotifications
    if (path.includes('/contacts')) return mockContacts
    if (path.includes('/guardians')) return mockGuardians
    if (path.includes('/security_ids')) return mockSecurityIds
    
    return []
  }

  // Original API code (for development)
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// Users
export const getUsers = () => req('/users')
export const getUserById = (id) => req(`/users/${id}`)
export const createUser = (data) => req('/users', { method: 'POST', body: data })
export const updateUser = (id, data) => req(`/users/${id}`, { method: 'PATCH', body: data })

// Auth (simulated with JSON server)
export const loginUser = async (email, password) => {
  const users = await getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  return user
}

// SOS Alerts
export const getAlerts = () => req('/sos_alerts?archived=false&_sort=created_at&_order=desc')
export const getAllAlerts = () => req('/sos_alerts?_sort=created_at&_order=desc')
export const getUserAlerts = (userId) => req(`/sos_alerts?user_id=${userId}&_sort=created_at&_order=desc`)
export const createAlert = (data) => req('/sos_alerts', { method: 'POST', body: { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), archived: false } })
export const updateAlert = (id, data) => req(`/sos_alerts/${id}`, { method: 'PATCH', body: { ...data, updated_at: new Date().toISOString() } })

// Safe Walks
export const getSafeWalks = () => req('/safe_walks?_sort=created_at&_order=desc')
export const getUserSafeWalks = (userId) => req(`/safe_walks?user_id=${userId}&_sort=created_at&_order=desc`)
export const createSafeWalk = (data) => req('/safe_walks', { method: 'POST', body: { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } })
export const updateSafeWalk = (id, data) => req(`/safe_walks/${id}`, { method: 'PATCH', body: { ...data, updated_at: new Date().toISOString() } })

// Incidents
export const getIncidents = () => req('/incidents?_sort=created_at&_order=desc')
export const getUserIncidents = (userId) => req(`/incidents?user_id=${userId}&_sort=created_at&_order=desc`)
export const createIncident = (data) => req('/incidents', { method: 'POST', body: { ...data, created_at: new Date().toISOString() } })
export const updateIncident = (id, data) => req(`/incidents/${id}`, { method: 'PATCH', body: data })

// Broadcasts
export const getBroadcasts = () => req('/broadcasts?_sort=created_at&_order=desc')
export const createBroadcast = (data) => req('/broadcasts', { method: 'POST', body: { ...data, created_at: new Date().toISOString() } })
export const deleteBroadcast = (id) => req(`/broadcasts/${id}`, { method: 'DELETE' })

// Notifications
export const getNotifications = () => req('/notifications?_sort=created_at&_order=desc')
export const createNotification = (data) => req('/notifications', { method: 'POST', body: { ...data, read: false, created_at: new Date().toISOString() } })
export const markNotificationRead = (id) => req(`/notifications/${id}`, { method: 'PATCH', body: { read: true } })

// Contacts
export const getContacts = (userId) => req(`/contacts?user_id=${userId}`)
export const createContact = (data) => req('/contacts', { method: 'POST', body: data })
export const deleteContact = (id) => req(`/contacts/${id}`, { method: 'DELETE' })

// Guardians
export const getGuardians = (studentId) => req(`/guardians?student_id=${studentId}`)
export const createGuardian = (data) => req('/guardians', { method: 'POST', body: data })
export const deleteGuardian = (id) => req(`/guardians/${id}`, { method: 'DELETE' })

// Security IDs
export const getSecurityIds = () => req('/security_ids')
export const generateSecurityIds = (count = 10) => {
  const ids = []
  for (let i = 0; i < count; i++) {
    const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
    ids.push({
      id: generateId(),
      code: `KNS${digits}`,
      used: false,
      created_at: new Date().toISOString()
    })
  }
  return Promise.all(ids.map(id => req('/security_ids', { method: 'POST', body: id })))
}
export const validateSecurityId = async (code) => {
  const ids = await getSecurityIds()
  const record = ids.find(r => r.code === code.toUpperCase().trim())
  if (!record) return { valid: false, error: 'Invalid Security ID' }
  if (record.used) return { valid: false, error: 'Security ID already claimed' }
  return { valid: true, record }
}
export const claimSecurityId = (id) => req(`/security_ids/${id}`, { method: 'PATCH', body: { used: true } })

// Geolocation
export const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
  navigator.geolocation.getCurrentPosition(
    pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
    () => resolve({ latitude: 6.6745, longitude: -1.5716 }) // KNUST fallback
  )
})

export const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)
