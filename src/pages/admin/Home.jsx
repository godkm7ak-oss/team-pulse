import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, ClipboardList, TrendingUp, Users, UserCheck, Umbrella, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatTime } from '../../lib/utils'
import { StatsSkeleton, ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'

export default function AdminHome() {
  const { company, profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState(null)
  const today = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    if (!company) return
    loadStats()
    loadActivity()
  }, [company])

  async function loadStats() {
    const todayStr = new Date().toISOString().split('T')[0]
    const [{ count: total }, { count: present }, { count: onLeave }, { count: pending }] = await Promise.all([
      supabase.from('employees').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'active'),
      supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('company_id', company.id).gte('check_in_at', todayStr),
      supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'approved').lte('start_date', todayStr).gte('end_date', todayStr),
      supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'pending'),
    ])
    setStats({ total, present, onLeave, pending })
  }

  async function loadActivity() {
    const { data } = await supabase
      .from('leave_requests')
      .select('*, employees(full_name)')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(5)
    setActivity(data || [])
  }

  const statCards = stats ? [
    { label: 'พนักงานทั้งหมด', value: stats.total, icon: Users,     color: 'text-primary-300', bg: 'bg-primary/10' },
    { label: 'เข้างานวันนี้',   value: stats.present, icon: UserCheck, color: 'text-green-400',   bg: 'bg-green-500/10' },
    { label: 'ลาวันนี้',        value: stats.onLeave, icon: Umbrella,  color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
    { label: 'รออนุมัติ',       value: stats.pending, icon: Clock,     color: 'text-orange-400',  bg: 'bg-orange-500/10' },
  ] : null

  return (
    <div className="px-5 pt-12 page-enter">
      {/* Header */}
      <div className="mb-6">
        <p className="text-white/40 text-sm mb-1">{today}</p>
        <h1 className="font-heading font-bold text-2xl">{company?.name || 'บริษัทของคุณ'}</h1>
      </div>

      {/* Stats */}
      <section className="mb-6">
        {!stats ? <StatsSkeleton /> : (
          <div className="grid grid-cols-2 gap-3">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <p className="text-white/50 text-xs mb-0.5">{label}</p>
                <p className="font-heading font-bold text-2xl">{value ?? '-'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/dashboard/team')}
                  className="card-hover flex items-center gap-3 text-left">
            <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4 text-primary-300" />
            </div>
            <span className="text-sm font-medium">เพิ่มพนักงาน</span>
          </button>
          <button onClick={() => navigate('/dashboard/leave')}
                  className="card-hover flex items-center gap-3 text-left">
            <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm font-medium">คำขอลา</span>
            {stats?.pending > 0 && (
              <span className="ml-auto w-5 h-5 bg-orange-500 rounded-full text-xs font-bold flex items-center justify-center">
                {stats.pending}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-base">กิจกรรมล่าสุด</h2>
          <button onClick={() => navigate('/dashboard/leave')} className="text-primary-300 text-sm">ดูทั้งหมด</button>
        </div>
        {activity === null ? <ListSkeleton count={3} /> : activity.length === 0 ? (
          <EmptyState icon="📋" title="ยังไม่มีกิจกรรม" description="เมื่อพนักงานขอลา จะแสดงที่นี่" />
        ) : (
          <div className="space-y-2">
            {activity.map(req => (
              <div key={req.id} className="card flex items-center gap-3">
                <div className="w-9 h-9 bg-white/8 rounded-full flex items-center justify-center text-sm shrink-0">
                  {req.employees?.full_name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{req.employees?.full_name}</p>
                  <p className="text-white/40 text-xs">{leaveTypeLabel(req.leave_type)} · {formatDate(req.start_date)}</p>
                </div>
                <span className={statusBadge(req.status)}>{statusLabel(req.status)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

const leaveTypeLabel = t => ({ sick: 'ลาป่วย', annual: 'ลาพักร้อน', personal: 'ลากิจ', emergency: 'ลาฉุกเฉิน' }[t] || t)
const statusLabel = s => ({ pending: 'รออนุมัติ', approved: 'อนุมัติ', rejected: 'ปฏิเสธ' }[s] || s)
const statusBadge = s => ({ pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }[s] || 'badge')
