import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

export default function EmployeeLogin() {
  const { signInEmployee } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ companyCode: '', employeeCode: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (form.companyCode.trim().length < 4) errs.companyCode = 'กรอกรหัสบริษัท 6 หลัก'
    if (form.employeeCode.trim().length < 3) errs.employeeCode = 'กรอกรหัสพนักงาน'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signInEmployee(form)
      navigate('/employee')
    } catch (err) {
      toast({ message: err.message || 'ไม่พบข้อมูล กรุณาตรวจสอบรหัส', type: 'error' })
      setErrors({ companyCode: ' ', employeeCode: ' ' })
    } finally {
      setLoading(false)
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value.toUpperCase() })); setErrors(p => ({ ...p, [key]: '' })) },
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
        <h1 className="font-heading font-bold text-2xl mb-1">เข้าสู่ระบบพนักงาน</h1>
        <p className="text-white/50 text-sm mb-8">ใช้รหัสที่ได้รับจาก HR หรือเจ้าของกิจการ</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">รหัสบริษัท</label>
            <input {...field('companyCode')} type="text" placeholder="เช่น ABC123" maxLength={8}
                   className={`input-field tracking-widest font-mono text-lg ${errors.companyCode ? 'border-red-500/50' : ''}`}
                   autoComplete="off" autoCapitalize="characters" />
            {errors.companyCode && errors.companyCode !== ' ' && <p className="text-red-400 text-xs mt-1.5">{errors.companyCode}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">รหัสพนักงาน</label>
            <input {...field('employeeCode')} type="text" placeholder="เช่น EMP001" maxLength={10}
                   className={`input-field tracking-widest font-mono text-lg ${errors.employeeCode ? 'border-red-500/50' : ''}`}
                   autoComplete="off" autoCapitalize="characters" />
            {errors.employeeCode && errors.employeeCode !== ' ' && <p className="text-red-400 text-xs mt-1.5">{errors.employeeCode}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/4 border border-white/8 rounded-2xl text-sm text-white/50 leading-relaxed">
          <p className="font-medium text-white/70 mb-1">ยังไม่มีรหัส?</p>
          ติดต่อ HR หรือเจ้าของกิจการเพื่อขอรหัสบริษัทและรหัสพนักงาน
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          เป็นเจ้าของกิจการ?{' '}
          <Link to="/login" className="text-primary-300 font-medium hover:text-primary-200">เข้าสู่ระบบแอดมิน</Link>
        </p>
      </div>
    </div>
  )
}
