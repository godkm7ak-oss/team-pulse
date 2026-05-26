import { useState } from 'react'
import { Copy, RefreshCw, LogOut, Loader2, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { ConfirmModal } from '../../components/ui/Modal'
import { generateCode, PLAN_LIMITS, planLabel } from '../../lib/utils'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

const PLANS = [
  { key: 'starter',  price: '฿490/เดือน',  features: ['สูงสุด 10 คน', 'เช็คอิน GPS + QR', 'จัดการลา'] },
  { key: 'pro',      price: '฿1,490/เดือน', features: ['สูงสุด 50 คน', 'ส่งออก CSV', 'รายงานขั้นสูง'] },
  { key: 'business', price: '฿3,490/เดือน', features: ['ไม่จำกัดพนักงาน', 'ทุกฟีเจอร์', 'API access'] },
]

export default function Settings() {
  const { company, profile, signOut, loadProfile } = useAuth()
  const toast = useToast()
  const [companyName, setCompanyName] = useState(company?.name || '')
  const [savingName, setSavingName] = useState(false)
  const [regenLoading, setRegenLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')

  const plan = company?.plan || 'trial'
  const limits = PLAN_LIMITS[plan]

  async function saveName() {
    if (!companyName.trim()) return
    setSavingName(true)
    const { error } = await supabase.from('companies').update({ name: companyName.trim() }).eq('id', company.id)
    if (error) toast({ message: 'บันทึกไม่สำเร็จ', type: 'error' })
    else { toast({ message: 'บันทึกแล้ว', type: 'success' }); loadProfile(profile.user_id) }
    setSavingName(false)
  }

  async function regenCode() {
    setRegenLoading(true)
    const newCode = generateCode(6)
    const { error } = await supabase.from('companies').update({ join_code: newCode }).eq('id', company.id)
    if (error) toast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    else { toast({ message: `รหัสใหม่: ${newCode}`, type: 'success' }); loadProfile(profile.user_id) }
    setRegenLoading(false)
  }

  function copyCode() {
    navigator.clipboard?.writeText(company?.join_code || '')
    toast({ message: 'คัดลอกรหัสแล้ว', type: 'success' })
  }

  async function handleUpgrade(planKey) {
    toast({ message: 'กำลังเปิดหน้าชำระเงิน...', type: 'info' })
    // In production: call your backend to create a Stripe Checkout session
    // const { data } = await supabase.functions.invoke('create-checkout', { body: { plan: planKey, company_id: company.id } })
    // window.location.href = data.url
    toast({ message: 'เชื่อม Stripe backend เพื่อเปิดใช้งานการชำระเงิน', type: 'warning' })
  }

  return (
    <div className="px-5 pt-12 pb-10 page-enter space-y-6">
      <h1 className="font-heading font-bold text-2xl">ตั้งค่า</h1>

      {/* Company info */}
      <section className="card space-y-4">
        <h2 className="font-heading font-semibold text-base">ข้อมูลบริษัท</h2>
        <div>
          <label className="block text-sm text-white/60 mb-1.5">ชื่อบริษัท</label>
          <div className="flex gap-2">
            <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                   className="input-field flex-1" placeholder="ชื่อบริษัท" />
            <button onClick={saveName} disabled={savingName || companyName === company?.name}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-40">
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'บันทึก'}
            </button>
          </div>
        </div>
      </section>

      {/* Join code */}
      <section className="card space-y-3">
        <h2 className="font-heading font-semibold text-base">รหัสเข้าร่วม</h2>
        <p className="text-white/40 text-sm">แจกรหัสนี้ให้พนักงานใช้เข้าสู่ระบบ</p>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <span className="font-mono font-bold text-2xl tracking-widest text-white flex-1">
            {company?.join_code || '------'}
          </span>
          <button onClick={copyCode} className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={regenCode} disabled={regenLoading}
                  className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all">
            {regenLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Plan */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-base">แผนปัจจุบัน</h2>
          <span className="badge-active">{planLabel(plan)}</span>
        </div>
        <p className="text-white/40 text-sm">{limits.employees === Infinity ? 'ไม่จำกัดพนักงาน' : `สูงสุด ${limits.employees} คน`}</p>

        {plan !== 'business' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/70 mb-3">อัปเกรดแผน</p>
            {PLANS.filter(p => p.key !== plan).map(p => (
              <div key={p.key} className="flex items-center justify-between p-3 bg-white/4 border border-white/8 rounded-2xl">
                <div>
                  <p className="font-medium text-sm">{planLabel(p.key)}</p>
                  <p className="text-white/40 text-xs">{p.features.join(' · ')}</p>
                </div>
                <button onClick={() => handleUpgrade(p.key)}
                        className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-button active:scale-95 transition-all">
                  {p.price}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Account */}
      <section className="card space-y-3">
        <h2 className="font-heading font-semibold text-base">บัญชี</h2>
        <p className="text-white/50 text-sm">{profile?.email}</p>
        <button onClick={signOut}
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium py-2 transition-colors">
          <LogOut className="w-4 h-4" /> ออกจากระบบ
        </button>
      </section>

      {/* Danger zone */}
      <section className="border border-red-500/20 rounded-3xl p-5 space-y-3">
        <h2 className="font-heading font-semibold text-base text-red-400">โซนอันตราย</h2>
        <p className="text-white/40 text-xs leading-relaxed">การลบบริษัทจะลบข้อมูลทั้งหมดอย่างถาวร ย้อนกลับไม่ได้</p>
        <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/10 active:scale-[0.97] transition-all">
          ลบบริษัทนี้
        </button>
      </section>

      <ConfirmModal open={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteInput('') }}
                   onConfirm={async () => {
                     if (deleteInput !== company?.name) { toast({ message: 'ชื่อบริษัทไม่ถูกต้อง', type: 'error' }); return }
                     await supabase.from('companies').delete().eq('id', company.id)
                     await signOut()
                   }}
                   title="ลบบริษัท" danger
                   message={`พิมพ์ "${company?.name}" เพื่อยืนยัน:`}>
        <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
               placeholder={company?.name} className="input-field mt-3" />
      </ConfirmModal>
    </div>
  )
}
