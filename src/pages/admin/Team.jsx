import { useEffect, useState } from 'react'
import { UserPlus, Copy, Check, MoreVertical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import BottomSheet from '../../components/ui/BottomSheet'
import { ConfirmModal } from '../../components/ui/Modal'
import { ListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/shared/EmptyState'
import { suggestEmployeeCode, PLAN_LIMITS } from '../../lib/utils'

export default function Team() {
  const { company } = useAuth()
  const toast = useToast()
  const [employees, setEmployees] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [actionEmp, setActionEmp] = useState(null)
  const [confirmDeactivate, setConfirmDeactivate] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', role: 'employee', employee_code: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { if (company) load() }, [company])

  async function load() {
    const { data } = await supabase.from('employees').select('*').eq('company_id', company.id).order('created_at')
    setEmployees(data || [])
    setForm(f => ({ ...f, employee_code: suggestEmployeeCode(data?.map(e => e.employee_code) || []) }))
  }

  const limit = PLAN_LIMITS[company?.plan || 'trial'].employees
  const atLimit = (employees?.length || 0) >= limit

  async function addEmployee() {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'กรุณากรอกชื่อ'
    if (!form.email.includes('@')) errs.email = 'อีเมลไม่ถูกต้อง'
    if (!form.employee_code.trim()) errs.employee_code = 'กรุณากรอกรหัสพนักงาน'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      // Create auth user + employee record via Supabase function
      const { error } = await supabase.from('employees').insert({
        company_id: company.id,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        employee_code: form.employee_code.trim().toUpperCase(),
        status: 'active',
      })
      if (error) throw error
      toast({ message: `เพิ่ม ${form.full_name} เรียบร้อย`, type: 'success' })
      setShowAdd(false)
      setForm({ full_name: '', email: '', role: 'employee', employee_code: '' })
      load()
    } catch (err) {
      toast({ message: err.message?.includes('duplicate') ? 'รหัสพนักงานซ้ำ' : 'เกิดข้อผิดพลาด', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function deactivate(emp) {
    const { error } = await supabase.from('employees').update({ status: 'inactive' }).eq('id', emp.id)
    if (error) { toast({ message: 'เกิดข้อผิดพลาด', type: 'error' }); return }
    toast({ message: `ปิดการใช้งาน ${emp.full_name} แล้ว`, type: 'success' })
    setConfirmDeactivate(null)
    setActionEmp(null)
    load()
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code)
    toast({ message: `คัดลอก ${code} แล้ว`, type: 'success' })
  }

  const f = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })) }
  })

  return (
    <div className="px-5 pt-12 page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">ทีมงาน</h1>
          <p className="text-white/40 text-sm">{employees?.length || 0} / {limit === Infinity ? '∞' : limit} คน</p>
        </div>
        <button onClick={() => atLimit ? toast({ message: `แผนปัจจุบันรองรับสูงสุด ${limit} คน`, type: 'warning' }) : setShowAdd(true)}
                className={`btn-primary px-4 py-2.5 text-sm ${atLimit ? 'opacity-50' : ''}`}>
          <UserPlus className="w-4 h-4" /> เพิ่ม
        </button>
      </div>

      {employees === null ? <ListSkeleton /> : employees.length === 0 ? (
        <EmptyState icon="👥" title="ยังไม่มีพนักงาน"
                    description="เพิ่มพนักงานคนแรกของคุณเพื่อเริ่มต้นใช้งาน"
                    action={{ label: 'เพิ่มพนักงาน', onClick: () => setShowAdd(true) }} />
      ) : (
        <div className="space-y-2">
          {employees.map(emp => (
            <div key={emp.id} className="card flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center font-semibold text-primary-300 shrink-0">
                {emp.full_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{emp.full_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <button onClick={() => copyCode(emp.employee_code)}
                          className="text-white/40 text-xs font-mono hover:text-white/70 flex items-center gap-1">
                    {emp.employee_code} <Copy className="w-3 h-3" />
                  </button>
                  <span className="text-white/20">·</span>
                  <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                    {emp.status === 'active' ? 'ทำงานอยู่' : 'ปิดการใช้งาน'}
                  </span>
                </div>
              </div>
              <button onClick={() => setActionEmp(emp)} className="w-8 h-8 rounded-full hover:bg-white/8 flex items-center justify-center text-white/40">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add employee sheet */}
      <BottomSheet open={showAdd} onClose={() => { setShowAdd(false); setErrors({}) }} title="เพิ่มพนักงาน" tall>
        <div className="space-y-4 pb-4">
          {[
            { key: 'full_name', label: 'ชื่อ-นามสกุล', type: 'text', placeholder: 'สมชาย ใจดี' },
            { key: 'email', label: 'อีเมล', type: 'email', placeholder: 'staff@company.com' },
            { key: 'employee_code', label: 'รหัสพนักงาน', type: 'text', placeholder: 'EMP001' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
              <input {...f(key)} type={type} placeholder={placeholder} className={`input-field ${errors[key] ? 'border-red-500/50' : ''}`} />
              {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">ตำแหน่ง</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="input-field">
              <option value="employee">พนักงาน</option>
              <option value="admin">แอดมิน</option>
            </select>
          </div>
          <div className="p-3 bg-white/4 rounded-2xl text-xs text-white/40 leading-relaxed">
            รหัสผ่านเริ่มต้นของพนักงาน = รหัสพนักงาน (ตัวพิมพ์เล็ก) · พนักงานสามารถเปลี่ยนได้ภายหลัง
          </div>
          <button onClick={addEmployee} disabled={saving} className="btn-primary w-full">
            {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'เพิ่มพนักงาน'}
          </button>
        </div>
      </BottomSheet>

      {/* Actions sheet */}
      <BottomSheet open={!!actionEmp} onClose={() => setActionEmp(null)} title={actionEmp?.full_name}>
        <div className="space-y-2 pb-4">
          <button onClick={() => { copyCode(actionEmp?.employee_code); setActionEmp(null) }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl hover:bg-white/5 text-sm flex items-center gap-3">
            <Copy className="w-4 h-4 text-white/50" /> คัดลอกรหัสพนักงาน
          </button>
          {actionEmp?.status === 'active' && (
            <button onClick={() => { setConfirmDeactivate(actionEmp); setActionEmp(null) }}
                    className="w-full text-left px-4 py-3.5 rounded-2xl hover:bg-red-500/10 text-sm flex items-center gap-3 text-red-400">
              ปิดการใช้งานบัญชี
            </button>
          )}
        </div>
      </BottomSheet>

      <ConfirmModal open={!!confirmDeactivate} onClose={() => setConfirmDeactivate(null)}
                   onConfirm={() => deactivate(confirmDeactivate)}
                   title="ปิดการใช้งาน" danger
                   message={`ต้องการปิดการใช้งานบัญชีของ ${confirmDeactivate?.full_name}? พนักงานจะไม่สามารถเข้าสู่ระบบได้`}
                   confirmLabel="ปิดการใช้งาน" />
    </div>
  )
}
