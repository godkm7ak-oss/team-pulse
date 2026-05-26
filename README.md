# TeamPulse

ระบบ HR & Attendance สำหรับบริษัท — จัดการการลา, เช็คอิน, กะการทำงาน, นัดประชุม, จัดตารางทีม รวมในแอปเดียว ออกแบบเป็น **mobile-first** เพื่อให้พอร์ตขึ้น iOS/Android ในอนาคตได้

---

## วิธีเปิดดู

เปิด `index.html` ในเบราว์เซอร์ (Chrome แนะนำ)

ถ้าจะให้ดีกว่า — รันด้วย Live Server (VSCode extension) เพื่อให้ทุกหน้ามี origin เดียวกัน

---

## วิธีทดสอบแบบครบลูป

### ขั้นที่ 1 — สร้างบริษัทและทีม (เป็นแอดมิน)

1. เปิด `index.html` → กด **"Start free trial"**
2. กรอกข้อมูล: ชื่อ, ชื่อบริษัท, อีเมล, รหัสผ่าน → กด **"Create company"**
3. เข้าหน้า Dashboard
4. ไปที่ **Profile** (icon ขวาสุดของ bottom nav) → **Company Settings**
5. กด **"Add default shifts"** → ระบบจะเพิ่ม 3 กะมาตรฐาน (เช้า/บ่าย/ดึก)
6. (ถ้าต้องการ) ปรับเวลาทำงาน, ตำแหน่งออฟฟิศ, จำนวนวันลา
7. กลับไป Profile → **Team** → กด `+` เพิ่มพนักงาน 2-3 คน
   - ระบบ auto-suggest รหัสพนักงาน (EMP001, EMP002, ...)
   - แก้ได้ตามใจ
8. คลิกที่พนักงาน → ดูกล่อง **"Login details"** สีฟ้า → copy **รหัสบริษัท** และ **รหัสพนักงาน**

### ขั้นที่ 2 — Login เป็นพนักงาน

> ⚠️ **สำคัญ**: ต้องใช้ browser/tab เดียวกันกับที่สร้างบริษัทไว้ เพราะข้อมูลเก็บใน localStorage

1. ออกจากระบบ — Profile → ปุ่มแดง **"Logout"**
2. กลับมาที่หน้า login → กดแท็บ **"สำหรับพนักงาน"**
3. ใส่ **รหัสบริษัท** + **รหัสพนักงาน** ที่ copy มา → Login
4. เข้า Dashboard เป็นพนักงาน

### ขั้นที่ 3 — ใช้งานเป็นพนักงาน

- **เช็คอิน**: tab Check In (icon กลาง) → เลือกกะ → เลือกวิธี (GPS/QR/Manual) → กดวงกลม
- **ลา**: tab Leave → กด `+` → กรอกประเภท, วันที่, เหตุผล → ส่งคำขอ
- **ดูตารางงาน**: tab Schedule → เห็น 7 วันข้างหน้า ว่าวันไหนเข้ากะไหน
- **ดูประชุม**: tab Schedule → tab Meetings ด้านบน
- **แก้รูปโปรไฟล์**: Profile → กดปุ่ม 📷 ที่มุมรูป

### ขั้นที่ 4 — Logout กลับเป็นแอดมิน

- ทำซ้ำขั้นที่ 2 แต่ใช้แท็บ **"สำหรับแอดมิน"** + ใส่อีเมล+รหัสผ่านที่สมัครไว้
- เป็นแอดมินแล้วเข้า **Schedule tab** → จัดกะให้พนักงานในแต่ละวัน
- ใน **Meetings** tab → สร้างนัดประชุม เลือกผู้เข้าร่วม

---

## Features

### สำหรับทุกคน
- เช็คอิน/เช็คเอาท์ — 3 วิธี: QR Code, GPS (ล็อคในรัศมีออฟฟิศ), Manual
- ยื่นลา 4 ประเภท: พักร้อน, ป่วย, กิจ, ฉุกเฉิน
- ดูตารางการทำงานของตัวเอง (รายสัปดาห์)
- ดูและสร้างนัดประชุม
- แก้ชื่อ, ตำแหน่ง, แผนก, เบอร์, อัพโหลดรูปโปรไฟล์
- เปลี่ยนรหัสผ่าน
- 2 ภาษา (ไทย/อังกฤษ)

### สำหรับแอดมิน
- Dashboard ภาพรวมทีม (จำนวนคน, เข้างานวันนี้, สาย, ลา)
- เพิ่ม/ลบพนักงาน + ดู/copy/reset รหัสพนักงาน
- อัพโหลดรูปโปรไฟล์ให้พนักงาน
- อนุมัติ/ปฏิเสธคำขอลา
- จัดกะการทำงานรายวันให้พนักงาน (grid: คน × วัน)
- เพิ่ม/แก้/ลบกะ (ชื่อ, เวลาเริ่ม-เลิก, สี)
- ตั้งค่าบริษัท — เวลาทำงาน, ผ่อนผันสาย, ตำแหน่งออฟฟิศ, รัศมี GPS, วิธีเช็คอินที่อนุญาต, จำนวนวันลามาตรฐาน
- Export attendance เป็น CSV
- จัดการ subscription

---

## โครงสร้างไฟล์

```
team-pulse/
├── README.md              ← ไฟล์นี้
├── index.html             ← Landing + pricing
├── auth.html              ← Login/Signup
├── dashboard.html         ← หน้าหลัก
├── checkin.html           ← เช็คอิน/เช็คเอาท์
├── leave.html             ← ระบบการลา
├── schedule.html          ← ตารางงาน + ประชุม (2 tabs)
├── employees.html         ← จัดการพนักงาน (admin)
├── attendance.html        ← ประวัติเข้างาน + CSV export
├── profile.html           ← โปรไฟล์ + เมนู More
├── settings.html          ← ตั้งค่าบริษัท + shifts (admin)
├── css/
│   └── style.css          ← Theme + components (mobile-first)
└── js/
    ├── data.js            ← Data layer (localStorage)
    ├── i18n.js            ← TH/EN translations
    └── ui.js              ← Shared header, nav, modals, toast
```

---

## Tech Stack

- **Vanilla HTML/CSS/JS** — ไม่มี framework
- **localStorage** — เก็บข้อมูลใน browser
- **Geolocation API** — สำหรับ GPS check-in
- **Canvas API** — สำหรับ resize รูปโปรไฟล์
- **Inter + Noto Sans Thai** font (Google Fonts)
- ไม่มี backend — ทุกอย่างทำงานใน browser

---

## Theme

- **Primary**: Indigo `#3B4FCA`
- **Accent**: Teal `#0EA5E9`
- **Background**: Slate `#F8FAFC`
- **Surface**: White
- Mobile-first: bottom nav, card layouts, bottom-sheet modals

---

## ข้อจำกัดสำคัญ (ต้องรู้)

### 1. localStorage แยกตาม browser
ตอนนี้ข้อมูลเก็บใน browser ของแต่ละเครื่อง = **ไม่ได้แชร์ข้ามอุปกรณ์**

- Chrome ปกติ ≠ Incognito ≠ Edge ≠ Firefox
- เปิดจาก `file://` ≠ จาก `http://localhost` (origin คนละตัว)

ตอนทดสอบให้ใช้ tab ใน browser เดียวกัน

### 2. ขนาดข้อมูลจำกัด ~5MB
รูปโปรไฟล์ถูก resize เหลือ 280px JPEG quality 82% (~10-20KB ต่อรูป) เก็บได้ ~100-200 รูปก่อนเต็ม

### 3. ไม่มี security
รหัสผ่านเก็บแบบ plaintext ใน localStorage — โอเคสำหรับ demo, **ห้ามใช้จริงตามนี้**

### 4. ไม่ส่งอีเมล/notification
ลาแล้ว / ประชุมใหม่ — ไม่ส่งแจ้งเตือนไปไหน เห็นแค่ในแอป

---

## ขั้นต่อไป (Roadmap แนะนำ)

### ระยะสั้น — ปรับ demo ให้ดีขึ้น
- [ ] เพิ่มปุ่ม "โหลดข้อมูลตัวอย่าง" ที่ landing — กดแล้วได้บริษัท + พนักงาน + ตารางพร้อมเล่น
- [ ] Export/Import ข้อมูลเป็น JSON (backup/transfer ระหว่าง browser)
- [ ] เพิ่มหน้า Report สำหรับ admin (สรุปสาย, OT, leave usage)

### ระยะกลาง — ทำให้ใช้จริงได้
- [ ] ต่อ backend จริง — แนะนำ **Supabase** (free tier ใช้ได้ดี, รองรับ multi-tenant ด้วย Row-Level Security)
- [ ] ระบบส่งอีเมล/Line Notify เวลามีคำขอลา หรือนัดประชุม
- [ ] Stripe / Omise สำหรับ subscription จริง
- [ ] Deploy บน Vercel/Netlify (ฟรี)

### ระยะยาว — มือถือจริง
- [ ] ห่อด้วย **Capacitor** → กลายเป็น iOS + Android app ใน 1 วัน (เพราะ UI mobile-first อยู่แล้ว)
- [ ] หรือเขียนใหม่เป็น React Native / Flutter ถ้าต้องการ native performance
- [ ] เพิ่ม push notification
- [ ] QR check-in ผ่านกล้องมือถือจริง

---

## License

Made by Sky (2026-05-26). ใช้งานส่วนตัวและทดลองได้

---

*สร้างด้วย Claude Code — ทุกหน้ามาจากการคุยกัน 3-4 รอบ*
