import { useLocation, Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function VerifyEmail() {
  const { state } = useLocation()
  const email = state?.email || 'อีเมลของคุณ'

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-5 text-center">
      <div className="w-16 h-16 bg-primary/15 rounded-3xl flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-primary-300" />
      </div>
      <h1 className="font-heading font-bold text-2xl mb-3">ตรวจสอบอีเมลของคุณ</h1>
      <p className="text-white/50 text-sm leading-relaxed mb-2 max-w-sm">
        เราส่งลิงก์ยืนยันไปที่
      </p>
      <p className="text-white font-medium mb-6">{email}</p>
      <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
        คลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชีของคุณ หากไม่พบ ให้ตรวจสอบในโฟลเดอร์สแปม
      </p>
      <Link to="/login" className="text-primary-300 text-sm font-medium hover:text-primary-200">
        กลับไปหน้าเข้าสู่ระบบ →
      </Link>
    </div>
  )
}
