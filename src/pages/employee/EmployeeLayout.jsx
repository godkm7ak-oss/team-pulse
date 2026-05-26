import { Outlet, NavLink } from 'react-router-dom'
import { Home, MapPin, CalendarDays, User } from 'lucide-react'

const tabs = [
  { to: '/employee',         icon: Home,          label: 'หน้าหลัก', end: true },
  { to: '/employee/checkin', icon: MapPin,         label: 'เช็คอิน' },
  { to: '/employee/leave',   icon: CalendarDays,   label: 'ลางาน' },
  { to: '/employee/profile', icon: User,           label: 'โปรไฟล์' },
]

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <main className="flex-1 pb-nav overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-navy-900/95 backdrop-blur-xl border-t border-white/8 bottom-nav">
        <div className="flex items-stretch h-16">
          {tabs.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
                     className={({ isActive }) =>
                       `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
                        ${isActive ? 'text-primary-300' : 'text-white/35 hover:text-white/60'}`}>
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
