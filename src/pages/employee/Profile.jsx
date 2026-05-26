import { useEffect, useState } from 'react'
import { LogOut, Copy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

const LEAVE_TYPES = [
  { value: 'sick',     label: 'ลาป่วย',    quota: 30, emoji: '🤒' },
  { value: 'annual',   label: 'ลาพักร้อน', quota: 10, emoji: '🏖️' },
  { value: 'personal', label: 'ลากิจ',     quota: 6,  emoji: '📋' },
]

export default function Profile() {
  const { profile, company, signOut } = useAuth()
  const toast = useToast()
  const [used, setUsed] = useState({})

  useEffect(() => { if (profile) loadUsed() }, [profile])

  async function loadUsed() {
    const year = new Date().getFullYear()
    const { data } = await supabase
      .from('leave_requests')
      .select('leave_type, start_date, end_date')
      .eq('employee_id', profile.id)
      .eq('status', 'approved')
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`)

    const totals = {}
    for (const r of data || []) {
      const days = Math.round((new Date(r.end_date) - new Date(r.start_date)) / 86400000) + 1
      totals[r.leave_type] = (totals[r.leave_type] || 0) + days
    }
    setUsed(totals)
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code)
    toast({ message: `คัดลอก ${code} แล้ว`, type: 'success' })
  }

  return (
    <div className="px-5 pt-12 pb-10 page-enter space-y-5">
      <h1 className="font-heading font-bold text-2xl">โปรไฟล์</h1>

      {/* Avatar + info */}
      <div className="card flex items-center gap-4">
        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-300 shrink-0">
          {profile?.full_name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-lg truncate">{profile?.full_name}</p>
          <p className="text-white/40 text-sm truncate">{profile?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-active">{profile?.role === 'admin' ? 'แอดมิน' : profile?.role === 'owner' ? 'เจ้าของ' : 'พนักงาน'}</span>
          </div>
        </div>
      </div>

      {/* Codes */}
      <div className="card space-y-3">
        <h2 className="font-heading font-semibold text-base">รหัสเข้าสู่ระบบ</h2>
        <div className="space-y-2">
          {[
            { label: 'รหัสบริษัท', value: company?.join_code },
            { label: 'รหัสพนักงาน', value: profile?.employee_code },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-white/5 rounded-xl">
              <div>
                <p className="text-white/40 text-xs">{label}</p>
                <p className="font-mono font-bold tracking-widest text-sm">{value || '—'}</p>
              </div>
              {value && (
                <button onClick={() => copyCode(value)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs leading-relaxed">แชร์รหัสบริษัทนี้ให้เพื่อนร่วมงานเพื่อเข้าสู่ระบบ</p>
      </div>

      {/* Leave balance */}
      <div className="card space-y-3">
        <h2 className="font-heading font-semibold text-base">วันลาคงเหลือ ({new Date().getFullYear()})</h2>
        <div className="space-y-3">
          {LEAVE_TYPES.map(({ value, label, quota, emoji }) => {
            const usedDays = used[value] || 0
            const remaining = Math.max(0, quota - usedDays)
            const pct = Math.min(100, (usedDays / quota) * 100)
            return (
              <div key={value}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{remaining} <span className="text-white/40 font-normal">/ {quota} วัน</span></span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-400' : pct > 50 ? 'bg-yellow-400' : 'bg-primary'}`}
                       style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Company */}
      <div className="card">
        <p className="text-white/40 text-xs mb-1">บริษัท</p>
        <p className="font-medium">{company?.name || '—'}</p>
      </div>

      {/* Sign out */}
      <button onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 text-white/60 font-medium hover:bg-white/5 active:scale-[0.97] transition-all">
        <LogOut className="w-4 h-4" /> ออกจากระบบ
      </button>
    </div>
  )
}
