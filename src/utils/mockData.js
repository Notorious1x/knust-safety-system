// Mock data for deployed demo when backend is not available

export const mockUsers = [
  {
    id: '1',
    email: 'student@knust.edu.gh',
    password: 'password123',
    full_name: 'Kwame Asante',
    phone: '+233501234567',
    role: 'student',
    student_id: '2021001234',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    email: 'security@knust.edu.gh',
    password: 'security123',
    full_name: 'Officer Mensah',
    phone: '+233501345678',
    role: 'security',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    email: 'guardian@gmail.com',
    password: 'guardian123',
    full_name: 'Mrs. Asante',
    phone: '+233501456789',
    role: 'guardian',
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-12T14:20:00Z'
  }
]

export const mockSosAlerts = [
  {
    id: '1',
    user_id: '1',
    type: 'medical',
    severity: 'high',
    message: 'Student feeling unwell at Main Library',
    latitude: 6.6745,
    longitude: -1.5716,
    location_name: 'KNUST Main Library',
    status: 'active',
    archived: false,
    created_at: '2024-01-20T15:30:00Z',
    updated_at: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    user_id: '1',
    type: 'security',
    severity: 'medium',
    message: 'Suspicious person near SRC building',
    latitude: 6.6750,
    longitude: -1.5720,
    location_name: 'SRC Building',
    status: 'acknowledged',
    archived: false,
    created_at: '2024-01-20T14:15:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  }
]

export const mockSafeWalks = [
  {
    id: '1',
    user_id: '1',
    from_location: 'Main Library',
    to_location: 'Hall 6',
    status: 'completed',
    companion_id: '2',
    notes: 'Walk completed safely',
    created_at: '2024-01-20T18:00:00Z',
    updated_at: '2024-01-20T18:30:00Z'
  },
  {
    id: '2',
    user_id: '1',
    from_location: 'Lecture Theater 1',
    to_location: 'Bus Stop',
    status: 'pending',
    companion_id: null,
    notes: 'Need companion for evening walk',
    created_at: '2024-01-20T20:00:00Z',
    updated_at: '2024-01-20T20:00:00Z'
  }
]

export const mockIncidents = [
  {
    id: '1',
    user_id: '1',
    type: 'theft',
    severity: 'medium',
    description: 'Backpack stolen from study area',
    location: 'Main Library 2nd Floor',
    latitude: 6.6745,
    longitude: -1.5716,
    status: 'investigating',
    created_at: '2024-01-19T16:45:00Z',
    updated_at: '2024-01-19T17:30:00Z'
  },
  {
    id: '2',
    user_id: '2',
    type: 'harassment',
    severity: 'high',
    description: 'Report of inappropriate behavior near sports field',
    location: 'Sports Field Area',
    latitude: 6.6760,
    longitude: -1.5730,
    status: 'resolved',
    created_at: '2024-01-18T19:20:00Z',
    updated_at: '2024-01-19T10:00:00Z'
  }
]

export const mockBroadcasts = [
  {
    id: '1',
    title: 'Campus Security Alert',
    message: 'Increased security presence on campus tonight due to recent incidents. Please stay vigilant.',
    severity: 'medium',
    created_by: '2',
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-01-20T12:00:00Z'
  },
  {
    id: '2',
    title: 'Maintenance Notice',
    message: 'Street lights on Science Road will be under maintenance from 10 PM to 2 AM.',
    severity: 'low',
    created_by: '2',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z'
  }
]

export const mockNotifications = [
  {
    id: '1',
    user_id: '1',
    title: 'Safe Walk Completed',
    message: 'Your safe walk from Main Library to Hall 6 has been completed.',
    type: 'safe_walk',
    read: false,
    created_at: '2024-01-20T18:30:00Z'
  },
  {
    id: '2',
    user_id: '1',
    title: 'SOS Alert Acknowledged',
    message: 'Security has acknowledged your SOS alert and is responding.',
    type: 'sos',
    read: false,
    created_at: '2024-01-20T15:45:00Z'
  },
  {
    id: '3',
    user_id: '2',
    title: 'New Incident Report',
    message: 'A new incident has been reported at Main Library.',
    type: 'incident',
    read: false,
    created_at: '2024-01-19T16:45:00Z'
  }
]

export const mockContacts = [
  {
    id: '1',
    user_id: '1',
    name: 'Dr. Asante',
    phone: '+233501234567',
    relationship: 'Parent',
    created_at: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    name: 'Nana Yaa',
    phone: '+233501345678',
    relationship: 'Sibling',
    created_at: '2024-01-15T11:05:00Z'
  },
  {
    id: '3',
    user_id: '3',
    name: 'Emergency Services',
    phone: '0501347350',
    relationship: 'Emergency',
    created_at: '2024-01-12T15:00:00Z'
  }
]

export const mockGuardians = [
  {
    id: '1',
    student_id: '1',
    name: 'Dr. Asante',
    phone: '+233501234567',
    email: 'asante.parent@gmail.com',
    created_at: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    student_id: '1',
    name: 'Mrs. Asante',
    phone: '+233501345678',
    email: 'asante.mother@gmail.com',
    created_at: '2024-01-15T11:05:00Z'
  }
]

export const mockSecurityIds = [
  {
    id: '1',
    code: 'KNS123456',
    used: false,
    assigned_to: null,
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    code: 'KNS789012',
    used: false,
    assigned_to: null,
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: '3',
    code: 'KNS345678',
    used: true,
    assigned_to: '2',
    created_at: '2024-01-10T08:00:00Z'
  }
]
