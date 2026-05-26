import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CalendarDays } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { greeting, formatDate, formatTime, toDateString } from '../../lib/utils'
import { StatsSkeleton, ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'

const LEAVE_LABELS = { sick: 'ลาป่วย', annual: 'ลาพักร้อน', personal: 'ลากิจ', emergency: 'ลาฉุกเฉิน' }

export default function EmployeeHome() {
  const { profile, company } = useAuth()
  const navigate = useNavigate()
  const [todayRecord, setTodayRecord] = useState(undefined)
  const [leaves, setLeaves] = useState(null)

  useEffect(() => {
    if (!profile) return
    loadToday()
    loadLeaves()
  }, [profile])

  async function loadToday() {
    const today = toDateString()
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', profile.id)
      .gte('check_in_at', `${today}T00:00:00`)
      .lte('check_in_at', `${today}T23:59:59`)
      .maybeSingle()
    setTodayRecord(data)
  }

  async function loadLeaves() {
    const { data } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(3)
    setLeaves(data || [])
  }

  const checkedIn = !!todayRecord

  return (
    <div className="px-5 pt-12 page-enter">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-white/40 text-sm mb-1">{greeting()}</p>
        <h1 className="font-heading font-bold text-2xl">{profile?.full_name?.split(' ')[0] || 'คุณ'}</h1>
        <p className="text-white/40 text-sm mt-0.5">{company?.name}</p>
      </div>

      {/* Today status */}
      <div onClick={() => navigate('/employee/checkin')}
           className={`card-hover mb-5 border-2 ${checkedIn ? 'border-green-500/30 bg-green-500/5' : 'border-primary/30 bg-primary/5'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl
                          ${checkedIn ? 'bg-green-500/20' : 'bg-primary/20'}`}>
            {checkedIn ? '✓' : '📍'}
          </div>
          <div className="flex-1">
            {todayRecord === undefined ? (
              <div className="space-y-1.5"><div className="shimmer h-4 w-32" /><div className="shimmer h-3 w-24" /></div>
            ) : checkedIn ? (
              <>
                <p className="font-semibold text-green-400">เช็คอินแล้ว</p>
                <p className="text-white/50 text-sm">
                  เข้างาน {formatTime(todayRecord.check_in_at)}
                  {todayRecord.check_out_at ? ` · ออก ${formatTime(todayRecord.check_out_at)}` : ' · แตะเพื่อเช็คเอาท์'}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">ยังไม่ได้เช็คอิน</p>
                <p className="text-white/50 text-sm">แตะเพื่อเช็คอินตอนนี้</p>
              </>
            )}
          </div>
          <MapPin className={`w-5 h-5 ${checkedIn ? 'text-green-400' : 'text-primary-300'}`} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => navigate('/employee/checkin')}
                className="card-hover flex flex-col items-start gap-2 p-4">
          <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-300" />
          </div>
          <span className="font-medium text-sm">เช็คอิน</span>
        </button>
        <button onClick={() => navigate('/employee/leave')}
                className="card-hover flex flex-col items-start gap-2 p-4">
          <div className="w-9 h-9 bg-yellow-500/15 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="font-medium text-sm">ขอลางาน</span>
        </button>
      </div>

      {/* Recent leaves */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-base">การลาล่าสุด</h2>
          <button onClick={() => navigate('/employee/leave')} className="text-primary-300 text-sm">ดูทั้งหมด</button>
        </div>
        {leaves === null ? <ListSkeleton count={2} /> : leaves.length === 0 ? (
          <EmptyState icon="📅" title="ยังไม่มีประวัติการลา" />
        ) : (
          <div className="space-y-2">
            {leaves.map(req => (
              <div key={req.id} className="card flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{LEAVE_LABELS[req.leave_type] || req.leave_type}</p>
                  <p className="text-white/40 text-xs">{formatDate(req.start_date)} – {formatDate(req.end_date)}</p>
                </div>
                <span className={`badge ${req.status === 'pending' ? 'badge-pending' : req.status === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                  {req.status === 'pending' ? 'รออนุมัติ' : req.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
