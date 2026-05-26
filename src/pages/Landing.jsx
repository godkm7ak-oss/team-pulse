import { Link } from 'react-router-dom'
import { MapPin, CalendarCheck, BarChart3, Shield, Check, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: MapPin,        title: 'เช็คอินด้วย GPS',     desc: 'พนักงานเช็คอินได้เฉพาะในรัศมีออฟฟิศ แสดงบนแผนที่แบบ real-time' },
  { icon: CalendarCheck, title: 'จัดการการลา',          desc: 'พนักงานขอลา ผู้จัดการอนุมัติหรือปฏิเสธได้ภายในคลิกเดียว' },
  { icon: BarChart3,     title: 'รายงานการเข้างาน',    desc: 'สรุปการเข้างานรายวัน ดูสถิติสาย ส่งออก CSV ได้' },
  { icon: Shield,        title: 'ปลอดภัย 100%',         desc: 'ข้อมูลเก็บในระบบ Supabase มาตรฐาน SOC 2 ใช้ไม่ได้ถ้าอยู่ผิดที่' },
]

const PLANS = [
  {
    key: 'trial', name: 'ทดลองใช้', price: 'ฟรี', sub: 'ตลอดไป',
    features: ['3 พนักงาน', 'GPS & QR เช็คอิน', 'จัดการลา', 'แดชบอร์ดพื้นฐาน'],
    cta: 'เริ่มฟรี', highlight: false,
  },
  {
    key: 'starter', name: 'Starter', price: '฿490', sub: '/เดือน',
    features: ['10 พนักงาน', 'GPS & QR เช็คอิน', 'จัดการลา', 'แดชบอร์ดพื้นฐาน'],
    cta: 'เริ่มทดลอง 14 วัน', highlight: false,
  },
  {
    key: 'pro', name: 'Pro', price: '฿1,490', sub: '/เดือน',
    features: ['50 พนักงาน', 'ส่งออก CSV', 'รายงานขั้นสูง', 'การแจ้งเตือน Email'],
    cta: 'เริ่มทดลอง 14 วัน', highlight: true,
  },
  {
    key: 'business', name: 'Business', price: '฿3,490', sub: '/เดือน',
    features: ['ไม่จำกัดพนักงาน', 'ทุกฟีเจอร์ Pro', 'API access', 'Priority support'],
    cta: 'ติดต่อเรา', highlight: false,
  },
]

const TESTIMONIALS = [
  { name: 'คุณ สมศรี จันทร์ดี', role: 'เจ้าของร้านอาหาร 12 สาขา', quote: 'ไม่ต้องใช้กระดาษอีกเลย พนักงานเช็คอินเองผ่านมือถือ ประหยัดเวลา HR ได้มาก' },
  { name: 'คุณ วิชัย ธนะรัตน์', role: 'HR Manager บริษัทโลจิสติกส์', quote: 'ระบบลาออนไลน์ดีมาก ผู้จัดการอนุมัติได้ทันทีผ่านมือถือ ไม่ต้องรอกลับออฟฟิศ' },
  { name: 'คุณ นภา สุขสวัสดิ์', role: 'เจ้าของบริษัท IT 30 คน', quote: 'ราคาถูกมากเมื่อเทียบกับระบบใหญ่ๆ แต่ฟีเจอร์ครบ ตั้งค่าเสร็จใน 10 นาที' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-navy-900/80 backdrop-blur-xl border-b border-white/8 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-button">
            <span className="text-base">⚡</span>
          </div>
          <span className="font-heading font-bold text-base">TeamPulse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/60 hover:text-white font-medium">เข้าสู่ระบบ</Link>
          <Link to="/signup" className="btn-primary px-4 py-2 text-sm">เริ่มฟรี</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/25 rounded-full text-primary-300 text-xs font-medium mb-6">
          ⚡ HR สำหรับธุรกิจไทย · ไม่ต้องใช้สเปรดชีต
        </div>
        <h1 className="font-heading font-bold text-4xl leading-tight mb-4">
          จัดการทีมงาน<br />
          <span className="text-gradient">ง่ายกว่าที่เคย</span>
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          เช็คอิน GPS · อนุมัติลา · ดูรายงาน ทั้งหมดในแอปเดียว ใช้งานผ่านมือถือได้เลย
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link to="/signup" className="btn-primary py-4 text-base">
            เริ่มใช้ฟรี — ไม่ต้องใช้บัตรเครดิต
          </Link>
          <Link to="/employee/login" className="btn-secondary py-3.5 text-sm">
            เข้าสู่ระบบพนักงาน
          </Link>
        </div>
        <p className="text-white/25 text-xs mt-4">ทดลองใช้ฟรี 3 พนักงาน · ตลอดไป</p>
      </section>

      {/* App screenshot mockup */}
      <section className="px-5 mb-16">
        <div className="max-w-sm mx-auto bg-navy-800 border border-white/10 rounded-3xl p-5 shadow-modal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-2xl flex items-center justify-center text-xl">✓</div>
            <div>
              <p className="font-semibold text-sm text-green-400">เช็คอินสำเร็จ</p>
              <p className="text-white/40 text-xs">อยู่ในรัศมีออฟฟิศ · ห่าง 34m</p>
            </div>
          </div>
          <div className="bg-navy-700/50 rounded-2xl h-28 flex items-center justify-center border border-white/8 mb-4">
            <div className="text-center">
              <div className="text-3xl mb-1">🗺️</div>
              <p className="text-white/30 text-xs">แผนที่ GPS แบบ Real-time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ l: 'เข้างานวันนี้', v: '08:52' }, { l: 'ห่างออฟฟิศ', v: '34m' }].map(({ l, v }) => (
              <div key={l} className="bg-white/5 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-0.5">{l}</p>
                <p className="font-heading font-bold text-lg">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 mb-16">
        <h2 className="font-heading font-bold text-2xl text-center mb-8">ทุกอย่างที่ HR ต้องการ</h2>
        <div className="space-y-4 max-w-sm mx-auto">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex gap-4">
              <div className="w-10 h-10 bg-primary/15 rounded-2xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 mb-16">
        <h2 className="font-heading font-bold text-2xl text-center mb-8">ธุรกิจไทยเชื่อใจ TeamPulse</h2>
        <div className="space-y-4 max-w-sm mx-auto">
          {TESTIMONIALS.map(({ name, role, quote }) => (
            <div key={name} className="card border-l-2 border-primary/40">
              <p className="text-white/70 text-sm leading-relaxed mb-3">"{quote}"</p>
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-white/40 text-xs">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-5 mb-16">
        <h2 className="font-heading font-bold text-2xl text-center mb-2">ราคาตรงไปตรงมา</h2>
        <p className="text-white/40 text-sm text-center mb-8">ไม่มีค่าธรรมเนียมซ่อน · ยกเลิกได้ทุกเมื่อ</p>
        <div className="space-y-4 max-w-sm mx-auto">
          {PLANS.map(({ key, name, price, sub, features, cta, highlight }) => (
            <div key={key} className={`card ${highlight ? 'border-primary/50 bg-primary/8' : ''}`}>
              {highlight && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary rounded-full text-xs font-semibold mb-3">
                  ⭐ ยอดนิยม
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-heading font-bold text-lg">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-bold text-2xl">{price}</span>
                    <span className="text-white/40 text-sm">{sub}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-green-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup"
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]
                                ${highlight ? 'btn-primary' : 'border border-white/15 hover:bg-white/5'}`}>
                {cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto card bg-gradient-to-br from-primary/20 to-indigo-900/20 border-primary/30 text-center p-8">
          <h2 className="font-heading font-bold text-2xl mb-3">พร้อมเริ่มแล้วหรือยัง?</h2>
          <p className="text-white/50 text-sm mb-6">ใช้ฟรีได้เลย ไม่ต้องใช้บัตรเครดิต</p>
          <Link to="/signup" className="btn-primary w-full py-4 text-base">
            สร้างบัญชีฟรี
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-10 text-center border-t border-white/8 pt-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
          <span className="font-heading font-bold">TeamPulse</span>
        </div>
        <p className="text-white/25 text-xs">© 2025 TeamPulse · ระบบ HR สำหรับธุรกิจไทย</p>
      </footer>
    </div>
  )
}
