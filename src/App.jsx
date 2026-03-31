import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext.jsx'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import AppShell from './components/AppShell'

import Dashboard from './pages/Dashboard'
import SOSPage from './pages/SOSPage'
import SafeWalk from './pages/SafeWalk'
import ReportIncident from './pages/ReportIncident'
import Alerts from './pages/Alerts'
import Guardians from './pages/Guardians'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

import SecurityDashboard from './pages/security/SecurityDashboard'
import SecurityAlerts from './pages/security/SecurityAlerts'
import SecuritySafeWalks from './pages/security/SecuritySafeWalks'
import SecurityIncidents from './pages/security/SecurityIncidents'
import SecurityBroadcast from './pages/security/SecurityBroadcast'
import SecurityUsers from './pages/security/SecurityUsers'

function Protected({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

function Public({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner" /></div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Public><Landing /></Public>} />
      <Route path="/login" element={<Public><Login /></Public>} />
      <Route path="/register" element={<Public><Register /></Public>} />

      <Route path="/dashboard" element={
        <Protected><AppShell>{user?.role === 'security' ? <SecurityDashboard /> : <Dashboard />}</AppShell></Protected>
      } />

      <Route path="/sos" element={<Protected roles={['student']}><AppShell><SOSPage /></AppShell></Protected>} />
      <Route path="/safe-walk" element={<Protected roles={['student','guardian']}><AppShell><SafeWalk /></AppShell></Protected>} />
      <Route path="/report" element={<Protected roles={['student']}><AppShell><ReportIncident /></AppShell></Protected>} />
      <Route path="/alerts" element={<Protected><AppShell><Alerts /></AppShell></Protected>} />
      <Route path="/guardians" element={<Protected roles={['student']}><AppShell><Guardians /></AppShell></Protected>} />
      <Route path="/notifications" element={<Protected><AppShell><Notifications /></AppShell></Protected>} />
      <Route path="/settings" element={<Protected><AppShell><Settings /></AppShell></Protected>} />
      <Route path="/profile" element={<Protected><AppShell><Profile /></AppShell></Protected>} />

      <Route path="/security/alerts" element={<Protected roles={['security']}><AppShell><SecurityAlerts /></AppShell></Protected>} />
      <Route path="/security/safe-walks" element={<Protected roles={['security']}><AppShell><SecuritySafeWalks /></AppShell></Protected>} />
      <Route path="/security/incidents" element={<Protected roles={['security']}><AppShell><SecurityIncidents /></AppShell></Protected>} />
      <Route path="/security/broadcast" element={<Protected roles={['security']}><AppShell><SecurityBroadcast /></AppShell></Protected>} />
      <Route path="/security/users" element={<Protected roles={['security']}><AppShell><SecurityUsers /></AppShell></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
