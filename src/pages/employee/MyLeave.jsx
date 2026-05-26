import { useEffect, useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import BottomSheet from '../../components/ui/BottomSheet'
import { ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'
import { formatDate, daysBetween, toDateString } from '../../lib/utils'

const LEAVE_TYPES = [
  { value: 'sick',      label: 'ลาป่วย',     emoji: '🤒' },
  { value: 'annual',    label: 'ลาพักร้อน',  emoji: '🏖️' },
  { value: 'personal',  label: 'ลากิจ',      emoji: '📋' },
  { value: 'emergency', label: 'ลาฉุกเฉิน', emoji: '🚨' },
]

export default function MyLeave() {
  const { profile, company } = useAuth()
  const toast = useToast()
  const [requests, setRequests] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ leave_type: 'annual', start_date: toDateString(), end_date: toDateString(), reason: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { if (profile) load() }, [profile])

  async function load() {
    const { data } = await supabase.from('leave_requests').select('*').eq('employee_id', profile.id).order('created_at', { ascending: false })
    setRequests(data || [])
  }

  function validate() {
    const e = {}
    if (!form.start_date) e.start_date = 'เลือกวันเริ่ม'
    if (!form.end_date)   e.end_date   = 'เลือกวันสิ้นสุด'
    if (form.end_date < form.start_date) e.end_date = 'วันสิ้นสุดต้องหลังวันเริ่ม'
    return e
  }

  async function submit() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const { error } = await supabase.from('leave_requests').insert({
        employee_id: profile.id,
        company_id: company.id,
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason.trim() || null,
        status: 'pending',
      })
      if (error) throw error
      toast({ message: 'ส่งคำขอลาแล้ว รอการอนุมัติ', type: 'success' })
      setShowForm(false)
      setForm({ leave_type: 'annual', start_date: toDateString(), end_date: toDateString(), reason: '' })
      load()
    } catch {
      toast({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const days = form.start_date && form.end_date && form.end_date >= form.start_date
    ? daysBetween(form.start_date, form.end_date) : 0

  return (
    <div className="px-5 pt-12 page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl">ลางาน</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary px-4 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> ขอลา
        </button>
      </div>

      {requests === null ? <ListSkeleton /> : requests.length === 0 ? (
        <EmptyState icon="📅" title="ยังไม่มีประวัติการลา"
                    description="แตะปุ่ม 'ขอลา' เพื่อส่งคำขอลางาน"
                    action={{ label: 'ขอลางาน', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const lt = LEAVE_TYPES.find(t => t.value === req.leave_type)
            return (
              <div key={req.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lt?.emoji || '📅'}</span>
                    <div>
                      <p className="font-semibold text-sm">{lt?.label || req.leave_type}</p>
                      <p className="text-white/40 text-xs">
                        {formatDate(req.start_date)} – {formatDate(req.end_date)} · {daysBetween(req.start_date, req.end_date)} วัน
                      </p>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ${req.status === 'pending' ? 'badge-pending' : req.status === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                    {req.status === 'pending' ? 'รออนุมัติ' : req.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                  </span>
                </div>
                {req.reason && <p className="text-white/40 text-xs bg-white/4 rounded-xl px-3 py-2">"{req.reason}"</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* Request leave sheet */}
      <BottomSheet open={showForm} onClose={() => { setShowForm(false); setErrors({}) }} title="ขอลางาน" tall>
        <div className="space-y-4 pb-4">
          {/* Leave type */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">ประเภทการลา</label>
            <div className="grid grid-cols-2 gap-2">
              {LEAVE_TYPES.map(t => (
                <button key={t.value} onClick={() => setForm(f => ({ ...f, leave_type: t.value }))}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-sm font-medium text-left transition-all
                                    ${form.leave_type === t.value
                                      ? 'border-primary bg-primary/15 text-white'
                                      : 'border-white/10 bg-white/4 text-white/60 hover:border-white/20'}`}>
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">วันเริ่ม</label>
              <input type="date" value={form.start_date}
                     onChange={e => { setForm(f => ({ ...f, start_date: e.target.value })); setErrors(p => ({ ...p, start_date: '' })) }}
                     className={`input-field ${errors.start_date ? 'border-red-500/50' : ''}`}
                     style={{ colorScheme: 'dark' }} />
              {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">วันสิ้นสุด</label>
              <input type="date" value={form.end_date} min={form.start_date}
                     onChange={e => { setForm(f => ({ ...f, end_date: e.target.value })); setErrors(p => ({ ...p, end_date: '' })) }}
                     className={`input-field ${errors.end_date ? 'border-red-500/50' : ''}`}
                     style={{ colorScheme: 'dark' }} />
              {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {days > 0 && (
            <p className="text-primary-300 text-sm text-center font-medium">{days} วัน</p>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">เหตุผล <span className="text-white/30">(ไม่บังคับ)</span></label>
            <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                      rows={3} placeholder="เช่น ไปพบแพทย์ตามนัด"
                      className="input-field resize-none leading-relaxed" />
          </div>

          <button onClick={submit} disabled={saving} className="btn-primary w-full">
            {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'ส่งคำขอ'}
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
