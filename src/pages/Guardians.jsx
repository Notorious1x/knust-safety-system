import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getGuardians, createGuardian, deleteGuardian, getContacts, createContact, deleteContact } from '../utils/api'

export default function Guardians() {
  const { user } = useAuth()
  const [guardians, setGuardians] = useState([])
  const [contacts, setContacts] = useState([])
  const [tab, setTab] = useState('guardians')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', relationship: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const load = () => {
    getGuardians(user.id).then(setGuardians)
    getContacts(user.id).then(setContacts)
  }

  useEffect(() => { load() }, [user.id])

  const addGuardian = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    try {
      const g = await createGuardian({ student_id: user.id, name: form.name, phone: form.phone, email: form.email, relationship: form.relationship })
      setGuardians(prev => [...prev, g])
      setForm({ name: '', phone: '', email: '', relationship: '' })
      setShowModal(false)
    } finally { setLoading(false) }
  }

  const addContact = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    try {
      const c = await createContact({ user_id: user.id, name: form.name, phone: form.phone, email: form.email, relationship: form.relationship })
      setContacts(prev => [...prev, c])
      setForm({ name: '', phone: '', email: '', relationship: '' })
      setShowModal(false)
    } finally { setLoading(false) }
  }

  const removeGuardian = async (id) => {
    await deleteGuardian(id)
    setGuardians(prev => prev.filter(g => g.id !== id))
  }

  const removeContact = async (id) => {
    await deleteContact(id)
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  const PersonCard = ({ person, onDelete }) => (
    <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div className="user-avatar" style={{ width: 44, height: 44, fontSize: 18, color: 'var(--blue)', flexShrink: 0 }}>
        {person.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{person.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>{person.relationship} · {person.phone}</div>
        {person.email && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{person.email}</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <a href={`tel:${person.phone}`} className="btn btn-secondary btn-sm">📞</a>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(person.id)}>🗑️</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1>Guardians & Contacts</h1>
        <p>Manage trusted people who can monitor your safety</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'guardians' ? 'active' : ''}`} onClick={() => setTab('guardians')}>👥 Guardians ({guardians.length})</button>
        <button className={`tab ${tab === 'contacts' ? 'active' : ''}`} onClick={() => setTab('contacts')}>📞 Emergency Contacts ({contacts.length})</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm({ name: '', phone: '', email: '', relationship: '' }) }}>
          + Add {tab === 'guardians' ? 'Guardian' : 'Contact'}
        </button>
      </div>

      {tab === 'guardians' && (
        guardians.length === 0
          ? <div className="card"><div className="empty-state"><div className="empty-icon">👥</div><h3>No guardians yet</h3><p>Add trusted contacts who can monitor your Safe Walk sessions</p></div></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{guardians.map(g => <PersonCard key={g.id} person={g} onDelete={removeGuardian} />)}</div>
      )}

      {tab === 'contacts' && (
        contacts.length === 0
          ? <div className="card"><div className="empty-state"><div className="empty-icon">📞</div><h3>No emergency contacts</h3><p>Add people to contact during emergencies</p></div></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{contacts.map(c => <PersonCard key={c.id} person={c} onDelete={removeContact} />)}</div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add {tab === 'guardians' ? 'Guardian' : 'Emergency Contact'}</h2>
              <p>This person will be notified during emergencies</p>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" placeholder="024XXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select className="form-select" value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                <option value="">Select...</option>
                {['Parent', 'Sibling', 'Spouse', 'Friend', 'Relative', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={loading || !form.name || !form.phone} onClick={tab === 'guardians' ? addGuardian : addContact}>
                {loading ? 'Adding...' : 'Add Person'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
