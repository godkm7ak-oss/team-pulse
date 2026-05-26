import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'

import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import AdminLogin from './pages/auth/AdminLogin'
import EmployeeLogin from './pages/auth/EmployeeLogin'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'

import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/Home'
import Team from './pages/admin/Team'
import LeaveRequests from './pages/admin/LeaveRequests'
import Attendance from './pages/admin/Attendance'
import Settings from './pages/admin/Settings'

import EmployeeLayout from './pages/employee/EmployeeLayout'
import EmployeeHome from './pages/employee/Home'
import CheckIn from './pages/employee/CheckIn'
import MyLeave from './pages/employee/MyLeave'
import Profile from './pages/employee/Profile'

function RequireAuth({ children, adminOnly = false }) {
  const { session, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace />
  if (adminOnly && profile && profile.role === 'employee') return <Navigate to="/employee" replace />
  return children
}

function RequireGuest({ children }) {
  const { session, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (session && profile) {
    return <Navigate to={profile.role === 'employee' ? '/employee' : '/dashboard'} replace />
  }
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-button">
          <span className="text-2xl">⚡</span>
        </div>
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/verify" element={<VerifyEmail />} />

            {/* Auth — guest only */}
            <Route path="/signup" element={<RequireGuest><SignUp /></RequireGuest>} />
            <Route path="/login" element={<RequireGuest><AdminLogin /></RequireGuest>} />
            <Route path="/employee/login" element={<RequireGuest><EmployeeLogin /></RequireGuest>} />
            <Route path="/forgot-password" element={<RequireGuest><ForgotPassword /></RequireGuest>} />

            {/* Admin dashboard */}
            <Route path="/dashboard" element={<RequireAuth adminOnly><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminHome />} />
              <Route path="team" element={<Team />} />
              <Route path="leave" element={<LeaveRequests />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Employee dashboard */}
            <Route path="/employee" element={<RequireAuth><EmployeeLayout /></RequireAuth>}>
              <Route index element={<EmployeeHome />} />
              <Route path="checkin" element={<CheckIn />} />
              <Route path="leave" element={<MyLeave />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
