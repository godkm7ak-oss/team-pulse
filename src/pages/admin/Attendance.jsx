import { useEffect, useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'
import { formatTime, toDateString, PLAN_LIMITS, downloadCSV } from '../../lib/utils'

export default function Attendance() {
  const { company } = useAuth()
  const toast = useToast()
  const [date, setDate] = useState(toDateString())
  const [records, setRecords] = useState(null)

  const canExport = PLAN_LIMITS[company?.plan || 'trial'].csvExport

  useEffect(() => { if (company) load() }, [company, date])

  async function load() {
    setRecords(null)
    const { data } = await supabase
      .from('attendance')
      .select('*, employees(full_name, employee_code)')
      .eq('company_id', company.id)
      .gte('check_in_at', `${date}T00:00:00`)
      .lte('check_in_at', `${date}T23:59:59`)
      .order('check_in_at')
    setRecords(data || [])
  }

  function shiftDate(days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(toDateString(d))
  }

  function handleExport() {
    if (!canExport) {
      toast({ message: 'ฟีเจอร์นี้สำหรับแผน Pro ขึ้นไป', type: 'warning' })
      return
    }
    const rows = records.map(r => ({
      ชื่อ: r.employees?.full_name,
      รหัส: r.employees?.employee_code,
      'เวลาเข้า': formatTime(r.check_in_at),
      'เวลาออก': r.check_out_at ? formatTime(r.check_out_at) : '-',
      วิธี: r.method === 'gps' ? 'GPS' : 'QR',
      สาย: r.is_late ? 'ใช่' : 'ไม่',
    }))
    downloadCSV(rows, `attendance-${date}.csv`)
    toast({ message: 'ดาวน์โหลด CSV แล้ว', type: 'success' })
  }

  const displayDate = new Date(date).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })
  const isToday = date === toDateString()

  return (
    <div className="px-5 pt-12 page-enter">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-heading font-bold text-2xl">การเข้างาน</h1>
        <button onClick={handleExport}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                            ${canExport ? 'border-white/15 text-white/70 hover:bg-white/5' : 'border-white/8 text-white/25'}`}>
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      {/* Date picker */}
      <div className="flex items-center justify-between bg-white/5 border border-white/8 rounded-2xl p-1 mb-5">
        <button onClick={() => shiftDate(-1)} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-medium text-sm">{displayDate}</p>
          {isToday && <p className="text-primary-300 text-xs">วันนี้</p>}
        </div>
        <button onClick={() => shiftDate(1)} disabled={isToday}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white active:scale-95 transition-all disabled:opacity-30">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Summary chips */}
      {records && records.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          <span className="shrink-0 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
            ✓ {records.length} คน
          </span>
          <span className="shrink-0 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-medium">
            สาย {records.filter(r => r.is_late).length} คน
          </span>
          <span className="shrink-0 px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-white/50 text-xs font-medium">
            ออกแล้ว {records.filter(r => r.check_out_at).length} คน
          </span>
        </div>
      )}

      {records === null ? <ListSkeleton /> : records.length === 0 ? (
        <EmptyState icon="🕐" title="ไม่มีข้อมูลการเข้างาน" description={`ไม่มีพนักงานเช็คอินในวัน${displayDate}`} />
      ) : (
        <div className="space-y-2">
          {records.map(r => (
            <div key={r.id} className="card flex items-center gap-3">
              <div className="w-9 h-9 bg-white/8 rounded-full flex items-center justify-center font-medium shrink-0">
                {r.employees?.full_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{r.employees?.full_name}</p>
                  {r.is_late && <span className="badge bg-red-500/15 text-red-400 shrink-0">สาย</span>}
                </div>
                <p className="text-white/40 text-xs">
                  เข้า {formatTime(r.check_in_at)} {r.check_out_at ? `· ออก ${formatTime(r.check_out_at)}` : '· ยังไม่ออก'} · {r.method?.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
