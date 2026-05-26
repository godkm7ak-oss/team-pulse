import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

export default function SignUp() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'กรุณากรอกชื่อ-นามสกุล'
    if (!form.companyName.trim()) e.companyName = 'กรุณากรอกชื่อบริษัท'
    if (!form.email.includes('@')) e.email = 'อีเมลไม่ถูกต้อง'
    if (form.password.length < 8) e.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await signUp(form)
      navigate('/auth/verify', { state: { email: form.email } })
    } catch (err) {
      const msg = err.message?.includes('already registered')
        ? 'อีเมลนี้ถูกใช้งานแล้ว'
        : err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      toast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })) },
  })

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col px-5 pt-safe">
      {/* Logo */}
      <div className="flex items-center gap-2.5 pt-12 pb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-button">
          <span className="text-lg">⚡</span>
        </div>
        <span className="font-heading font-bold text-lg">TeamPulse</span>
      </div>

      <div className="flex-1">
        <h1 className="font-heading font-bold text-2xl mb-1">สร้างบัญชีบริษัท</h1>
        <p className="text-white/50 text-sm mb-8">ทดลองใช้ฟรี 3 พนักงาน ไม่ต้องใช้บัตรเครดิต</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="ชื่อ-นามสกุล" error={errors.fullName}>
            <input {...field('fullName')} type="text" placeholder="สมชาย ใจดี" className="input-field" autoComplete="name" />
          </Field>
          <Field label="ชื่อบริษัท / ร้าน" error={errors.companyName}>
            <input {...field('companyName')} type="text" placeholder="ร้านกาแฟริมทาง" className="input-field" autoComplete="organization" />
          </Field>
          <Field label="อีเมล" error={errors.email}>
            <input {...field('email')} type="email" placeholder="you@company.com" className="input-field" autoComplete="email" />
          </Field>
          <Field label="รหัสผ่าน" error={errors.password}>
            <div className="relative">
              <input {...field('password')} type={showPass ? 'text' : 'password'} placeholder="อย่างน้อย 8 ตัวอักษร"
                     className="input-field pr-12" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </Field>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'สร้างบัญชี'}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-primary-300 font-medium hover:text-primary-200">เข้าสู่ระบบ</Link>
        </p>
      </div>

      <p className="text-xs text-white/25 text-center py-6 leading-relaxed">
        การสมัครถือว่าคุณยอมรับ{' '}
        <span className="text-white/40">เงื่อนไขการให้บริการ</span>
        {' '}และ{' '}
        <span className="text-white/40">นโยบายความเป็นส่วนตัว</span>
      </p>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  )
}
