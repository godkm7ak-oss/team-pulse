import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.email.includes('@')) errs.email = 'อีเมลไม่ถูกต้อง'
    if (!form.password) errs.password = 'กรุณากรอกรหัสผ่าน'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signIn(form)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.message?.toLowerCase().includes('invalid')
        ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      toast({ message: msg, type: 'error' })
      setErrors({ password: ' ' })
    } finally {
      setLoading(false)
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })) },
  })

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col px-5">
      <div className="flex items-center gap-2.5 pt-12 pb-8">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-button">
          <span className="text-lg">⚡</span>
        </div>
        <span className="font-heading font-bold text-lg">TeamPulse</span>
      </div>

      <div className="flex-1">
        <h1 className="font-heading font-bold text-2xl mb-1">เข้าสู่ระบบ</h1>
        <p className="text-white/50 text-sm mb-8">สำหรับเจ้าของกิจการและ HR</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">อีเมล</label>
            <input {...field('email')} type="email" placeholder="you@company.com"
                   className={`input-field ${errors.email ? 'border-red-500/50' : ''}`} autoComplete="email" />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">รหัสผ่าน</label>
            <div className="relative">
              <input {...field('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                     className={`input-field pr-12 ${errors.password ? 'border-red-500/50' : ''}`} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && errors.password !== ' ' && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary-300 hover:text-primary-200">ลืมรหัสผ่าน?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Employee login switch */}
        <div className="mt-6 p-4 bg-white/4 border border-white/8 rounded-2xl">
          <p className="text-sm text-white/50 mb-2">เป็นพนักงาน?</p>
          <Link to="/employee/login"
                className="text-sm font-medium text-primary-300 hover:text-primary-200 flex items-center gap-1">
            เข้าสู่ระบบด้วยรหัสพนักงาน →
          </Link>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          ยังไม่มีบัญชี?{' '}
          <Link to="/signup" className="text-primary-300 font-medium hover:text-primary-200">สมัครฟรี</Link>
        </p>
      </div>
    </div>
  )
}
