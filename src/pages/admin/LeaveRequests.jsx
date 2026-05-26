import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { ConfirmModal } from '../../components/ui/Modal'
import { ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'
import { formatDate, daysBetween } from '../../lib/utils'
import { Check, X } from 'lucide-react'

const TABS = [
  { key: 'pending',  label: 'รออนุมัติ' },
  { key: 'approved', label: 'อนุมัติแล้ว' },
  { key: 'rejected', label: 'ปฏิเสธ' },
  { key: 'all',      label: 'ทั้งหมด' },
]

const LEAVE_LABELS = { sick: 'ลาป่วย', annual: 'ลาพักร้อน', personal: 'ลากิจ', emergency: 'ลาฉุกเฉิน' }

export default function LeaveRequests() {
  const { company, profile } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const [requests, setRequests] = useState(null)
  const [confirm, setConfirm] = useState(null) // { req, action }
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (company) load() }, [company, tab])

  async function load() {
    setRequests(null)
    let q = supabase.from('leave_requests').select('*, employees(full_name, employee_code)')
      .eq('company_id', company.id).order('created_at', { ascending: false })
    if (tab !== 'all') q = q.eq('status', tab)
    const { data } = await q
    setRequests(data || [])
  }

  async function updateStatus(req, status) {
    setLoading(true)
    const { error } = await supabase.from('leave_requests').update({ status, reviewed_by: profile.id }).eq('id', req.id)
    if (error) {
      toast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    } else {
      toast({ message: status === 'approved' ? `อนุมัติคำขอของ ${req.employees?.full_name} แล้ว` : 'ปฏิเสธคำขอแล้ว', type: 'success' })
      load()
    }
    setLoading(false)
    setConfirm(null)
  }

  const pendingCount = requests?.filter(r => r.status === 'pending').length

  return (
    <div className="px-5 pt-12 page-enter">
      <h1 className="font-heading font-bold text-2xl mb-5">คำขอลางาน</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mb-5 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 min-w-max py-2 px-3 rounded-xl text-sm font-medium transition-all
                              ${tab === t.key ? 'bg-primary text-white shadow-button' : 'text-white/50 hover:text-white/80'}`}>
            {t.label}
            {t.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 w-4 h-4 bg-white/20 rounded-full text-xs inline-flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {requests === null ? <ListSkeleton /> : requests.length === 0 ? (
        <EmptyState icon="📅" title="ไม่มีคำขอ" description={tab === 'pending' ? 'ยังไม่มีคำขอที่รอการอนุมัติ' : 'ไม่พบคำขอในหมวดนี้'} />
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/8 rounded-full flex items-center justify-center font-medium shrink-0">
                    {req.employees?.full_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{req.employees?.full_name}</p>
                    <p className="text-white/40 text-xs">{req.employees?.employee_code}</p>
                  </div>
                </div>
                <span className={`badge ${req.status === 'pending' ? 'badge-pending' : req.status === 'approved' ? 'badge-approved' : 'badge-rejected'}`}>
                  {req.status === 'pending' ? 'รออนุมัติ' : req.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">ประเภท</span>
                  <span className="font-medium">{LEAVE_LABELS[req.leave_type] || req.leave_type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">วันที่</span>
                  <span className="font-medium">{formatDate(req.start_date)} – {formatDate(req.end_date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">จำนวนวัน</span>
                  <span className="font-medium">{daysBetween(req.start_date, req.end_date)} วัน</span>
                </div>
              </div>

              {req.reason && (
                <p className="text-white/40 text-xs bg-white/4 rounded-xl px-3 py-2 mb-3">"{req.reason}"</p>
              )}

              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => setConfirm({ req, action: 'rejected' })} disabled={loading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 active:scale-[0.97] transition-all">
                    <X className="w-4 h-4" /> ปฏิเสธ
                  </button>
                  <button onClick={() => setConfirm({ req, action: 'approved' })} disabled={loading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/25 active:scale-[0.97] transition-all">
                    <Check className="w-4 h-4" /> อนุมัติ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)}
                   onConfirm={() => updateStatus(confirm.req, confirm.action)}
                   title={confirm?.action === 'approved' ? 'อนุมัติคำขอลา' : 'ปฏิเสธคำขอลา'}
                   danger={confirm?.action === 'rejected'}
                   message={confirm?.action === 'approved'
                     ? `อนุมัติการลาของ ${confirm?.req.employees?.full_name}?`
                     : `ปฏิเสธการลาของ ${confirm?.req.employees?.full_name}?`}
                   confirmLabel={confirm?.action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                   loading={loading} />
    </div>
  )
}
