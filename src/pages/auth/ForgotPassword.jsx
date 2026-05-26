import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@')) { toast({ message: 'อีเมลไม่ถูกต้อง', type: 'error' }); return }
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      toast({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col px-5">
      <div className="pt-12 pb-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> กลับ
        </Link>
      </div>

      {sent ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="font-heading font-bold text-xl mb-3">ส่งลิงก์รีเซ็ตแล้ว</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">ตรวจสอบอีเมล {email} แล้วคลิกลิงก์เพื่อตั้งรหัสผ่านใหม่</p>
          <Link to="/login" className="btn-primary px-8">กลับไปเข้าสู่ระบบ</Link>
        </div>
      ) : (
        <div className="flex-1">
          <h1 className="font-heading font-bold text-2xl mb-1">ลืมรหัสผ่าน</h1>
          <p className="text-white/50 text-sm mb-8">กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์รีเซ็ตให้</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">อีเมล</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="you@company.com" className="input-field" autoComplete="email" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ส่งลิงก์รีเซ็ต'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
