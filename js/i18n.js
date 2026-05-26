// TeamPulse — Bilingual EN/TH

const I18N = {
  dict: {
    // Common
    'TeamPulse': { th: 'TeamPulse' },
    'Dashboard': { th: 'หน้าหลัก' },
    'Check In': { th: 'เช็คอิน' },
    'Check Out': { th: 'เช็คเอาท์' },
    'Leave': { th: 'การลา' },
    'Team': { th: 'ทีม' },
    'Profile': { th: 'โปรไฟล์' },
    'Settings': { th: 'ตั้งค่า' },
    'Attendance': { th: 'เวลาเข้างาน' },
    'Employees': { th: 'พนักงาน' },
    'Logout': { th: 'ออกจากระบบ' },
    'Login': { th: 'เข้าสู่ระบบ' },
    'Sign Up': { th: 'สมัครสมาชิก' },
    'Email': { th: 'อีเมล' },
    'Password': { th: 'รหัสผ่าน' },
    'Name': { th: 'ชื่อ' },
    'Full Name': { th: 'ชื่อ-นามสกุล' },
    'Company Name': { th: 'ชื่อบริษัท' },
    'Join Code': { th: 'รหัสบริษัท' },
    'Submit': { th: 'ส่ง' },
    'Cancel': { th: 'ยกเลิก' },
    'Save': { th: 'บันทึก' },
    'Delete': { th: 'ลบ' },
    'Edit': { th: 'แก้ไข' },
    'Add': { th: 'เพิ่ม' },
    'Approve': { th: 'อนุมัติ' },
    'Reject': { th: 'ปฏิเสธ' },
    'Pending': { th: 'รอดำเนินการ' },
    'Approved': { th: 'อนุมัติแล้ว' },
    'Rejected': { th: 'ปฏิเสธ' },
    'All': { th: 'ทั้งหมด' },
    'Today': { th: 'วันนี้' },
    'Yesterday': { th: 'เมื่อวาน' },
    'This Week': { th: 'สัปดาห์นี้' },
    'This Month': { th: 'เดือนนี้' },
    'days': { th: 'วัน' },
    'day': { th: 'วัน' },
    'hours': { th: 'ชั่วโมง' },
    'minutes': { th: 'นาที' },
    'On time': { th: 'ตรงเวลา' },
    'Late': { th: 'สาย' },
    'Absent': { th: 'ขาด' },
    'Working': { th: 'กำลังทำงาน' },
    'Not checked in': { th: 'ยังไม่เช็คอิน' },
    'Checked out': { th: 'เช็คเอาท์แล้ว' },

    // Landing
    'Smart HR for modern teams': { th: 'ระบบ HR สำหรับทีมยุคใหม่' },
    'Manage leave, attendance, and your team — all in one simple app. Built for companies that want to stop using spreadsheets.': { th: 'จัดการการลา เวลาเข้างาน และทีมงาน — รวมในแอปเดียว สำหรับบริษัทที่อยากเลิกใช้ Excel ในการจัดการคน' },
    'Start free trial': { th: 'เริ่มทดลองใช้ฟรี' },
    'Sign in': { th: 'เข้าสู่ระบบ' },
    'Everything you need to manage your team': { th: 'ทุกอย่างที่ต้องใช้บริหารทีม' },
    'Built for Thai SMEs who want to run their team professionally without the complexity.': { th: 'ออกแบบสำหรับธุรกิจไทยที่อยากบริหารทีมแบบมืออาชีพ โดยไม่ต้องซับซ้อน' },
    'Leave Management': { th: 'จัดการการลา' },
    'Sick, annual, personal, emergency — employees request, you approve. Balances tracked automatically.': { th: 'ลาป่วย ลาพักร้อน ลากิจ ลาฉุกเฉิน — พนักงานยื่นลา คุณกดอนุมัติ ระบบนับวันลาให้อัตโนมัติ' },
    'Smart Check-in': { th: 'เช็คอินอัจฉริยะ' },
    'QR code at the office or GPS location lock. Track lateness automatically.': { th: 'สแกน QR ที่ออฟฟิศ หรือล็อคตำแหน่ง GPS ระบบบันทึกเวลาเข้างานและสายให้อัตโนมัติ' },
    'Team Overview': { th: 'ภาพรวมทีม' },
    'See who is in, who is out, and who is on leave — at a glance.': { th: 'ดูในนาทีเดียวว่าใครเข้างาน ใครลา ใครยังไม่เช็คอิน' },
    'Multi-company': { th: 'รองรับหลายบริษัท' },
    'Each company gets their own private workspace with a unique join code.': { th: 'แต่ละบริษัทมี workspace ของตัวเอง พร้อมรหัสเข้าทีม' },
    'Mobile-first': { th: 'ใช้งานบนมือถือ' },
    'Designed for phones. Works on any device with a browser.': { th: 'ออกแบบสำหรับมือถือ ใช้งานได้บนทุกอุปกรณ์ที่มีเบราว์เซอร์' },
    'Affordable': { th: 'ราคาเข้าถึงได้' },
    'Per-employee pricing in THB. Start small, scale as you grow.': { th: 'คิดราคาตามจำนวนพนักงาน เริ่มจากเล็ก ขยายเมื่อโตขึ้น' },
    'Simple, transparent pricing': { th: 'ราคาชัดเจน โปร่งใส' },
    'Pay only for what you use. Cancel anytime.': { th: 'จ่ายตามที่ใช้ ยกเลิกเมื่อไหร่ก็ได้' },
    'Starter': { th: 'เริ่มต้น' },
    'Pro': { th: 'โปร' },
    'Business': { th: 'ธุรกิจ' },
    'Up to 10 employees': { th: 'พนักงานไม่เกิน 10 คน' },
    'Up to 50 employees': { th: 'พนักงานไม่เกิน 50 คน' },
    'Unlimited employees': { th: 'พนักงานไม่จำกัด' },
    'Leave management': { th: 'จัดการการลา' },
    'GPS check-in': { th: 'เช็คอินด้วย GPS' },
    'QR check-in': { th: 'เช็คอินด้วย QR Code' },
    'Reports & exports': { th: 'รายงานและส่งออกข้อมูล' },
    'Email support': { th: 'ช่วยเหลือทางอีเมล' },
    'Priority support': { th: 'ช่วยเหลือแบบเร่งด่วน' },
    'Custom branding': { th: 'แบรนด์ของบริษัทเอง' },
    'API access': { th: 'เชื่อมต่อ API' },
    'Most popular': { th: 'นิยมที่สุด' },
    'Get started': { th: 'เริ่มต้น' },
    '/month': { th: '/เดือน' },

    // Auth
    'Welcome back': { th: 'ยินดีต้อนรับกลับมา' },
    'Sign in to your account': { th: 'เข้าสู่ระบบของคุณ' },
    'Create your account': { th: 'สมัครสมาชิกใหม่' },
    'For company admins': { th: 'สำหรับเจ้าของ/หัวหน้าทีม' },
    'For employees': { th: 'สำหรับพนักงาน' },
    'I am an admin': { th: 'ฉันเป็นแอดมิน' },
    'I am an employee': { th: 'ฉันเป็นพนักงาน' },
    'Create company': { th: 'สร้างบริษัทใหม่' },
    'Join company': { th: 'เข้าร่วมบริษัท' },
    'Your full name': { th: 'ชื่อ-นามสกุลของคุณ' },
    'your@email.com': { th: 'อีเมลของคุณ' },
    'At least 6 characters': { th: 'อย่างน้อย 6 ตัวอักษร' },
    'Acme Co., Ltd.': { th: 'เช่น บริษัท แอคมี จำกัด' },
    'Enter the code from your admin': { th: 'รหัสที่ได้รับจากแอดมิน' },
    'Already have an account?': { th: 'มีบัญชีอยู่แล้ว?' },
    'Don\'t have an account?': { th: 'ยังไม่มีบัญชี?' },

    // Dashboard / Home
    'Good morning': { th: 'อรุณสวัสดิ์' },
    'Good afternoon': { th: 'สวัสดีตอนบ่าย' },
    'Good evening': { th: 'สวัสดีตอนเย็น' },
    'Status': { th: 'สถานะ' },
    'Time in': { th: 'เวลาเข้า' },
    'Time out': { th: 'เวลาออก' },
    'Quick Actions': { th: 'ทำงานด่วน' },
    'Request leave': { th: 'ยื่นลา' },
    'View team': { th: 'ดูทีม' },
    'View calendar': { th: 'ดูปฏิทิน' },
    'Annual leave': { th: 'ลาพักร้อน' },
    'Sick leave': { th: 'ลาป่วย' },
    'Personal leave': { th: 'ลากิจ' },
    'Emergency leave': { th: 'ลาฉุกเฉิน' },
    'Used': { th: 'ใช้ไปแล้ว' },
    'Remaining': { th: 'คงเหลือ' },
    'Recent activity': { th: 'กิจกรรมล่าสุด' },
    'No activity yet': { th: 'ยังไม่มีกิจกรรม' },
    'Pending requests': { th: 'คำขอที่รออนุมัติ' },
    'No pending requests': { th: 'ไม่มีคำขอ' },
    'Total employees': { th: 'จำนวนพนักงาน' },
    'In today': { th: 'เข้างานวันนี้' },
    'On leave': { th: 'ลา' },
    'Late today': { th: 'สายวันนี้' },

    // Check-in
    'Tap to check in': { th: 'แตะเพื่อเช็คอิน' },
    'Tap to check out': { th: 'แตะเพื่อเช็คเอาท์' },
    'You are checked in': { th: 'คุณเช็คอินแล้ว' },
    'Check-in method': { th: 'วิธีเช็คอิน' },
    'GPS': { th: 'GPS' },
    'QR Code': { th: 'QR Code' },
    'Manual': { th: 'บันทึกเอง' },
    'Scan this QR code at the office': { th: 'สแกน QR Code ที่ออฟฟิศ' },
    'Or enter code': { th: 'หรือกรอกรหัส' },
    'You are not at the office location': { th: 'คุณไม่ได้อยู่ในตำแหน่งของออฟฟิศ' },
    'GPS check-in successful': { th: 'เช็คอินด้วย GPS สำเร็จ' },
    'Check-in successful': { th: 'เช็คอินสำเร็จ' },
    'Check-out successful': { th: 'เช็คเอาท์สำเร็จ' },
    'Already checked in today': { th: 'เช็คอินวันนี้ไปแล้ว' },
    'Invalid QR code': { th: 'รหัส QR ไม่ถูกต้อง' },
    'Getting location...': { th: 'กำลังหาตำแหน่ง...' },
    'Location not available': { th: 'หาตำแหน่งไม่เจอ' },
    'distance': { th: 'ระยะห่าง' },
    'm away': { th: 'เมตร' },

    // Leave
    'Request Leave': { th: 'ยื่นใบลา' },
    'My Leaves': { th: 'การลาของฉัน' },
    'Team Leaves': { th: 'การลาของทีม' },
    'Leave type': { th: 'ประเภทการลา' },
    'Start date': { th: 'วันเริ่มต้น' },
    'End date': { th: 'วันสิ้นสุด' },
    'Reason': { th: 'เหตุผล' },
    'Total days': { th: 'รวมจำนวนวัน' },
    'Submit request': { th: 'ส่งคำขอ' },
    'No leave requests yet': { th: 'ยังไม่มีคำขอลา' },
    'Tap "Request leave" to create one': { th: 'กด "ยื่นลา" เพื่อสร้างคำขอ' },
    'requested': { th: 'ยื่นขอลา' },
    'Reviewed by': { th: 'อนุมัติโดย' },
    'Leave balance': { th: 'วันลาคงเหลือ' },

    // Employees
    'Add employee': { th: 'เพิ่มพนักงาน' },
    'Search employees': { th: 'ค้นหาพนักงาน' },
    'Position': { th: 'ตำแหน่ง' },
    'Department': { th: 'แผนก' },
    'Phone': { th: 'เบอร์โทร' },
    'Hire date': { th: 'วันที่เริ่มงาน' },
    'Employee details': { th: 'รายละเอียดพนักงาน' },
    'No employees yet': { th: 'ยังไม่มีพนักงาน' },
    'Share join code': { th: 'แชร์รหัสบริษัท' },
    'Send this code to your team to let them join': { th: 'ส่งรหัสนี้ให้พนักงานเพื่อเข้าร่วมบริษัท' },
    'Copy': { th: 'คัดลอก' },
    'Copied!': { th: 'คัดลอกแล้ว!' },
    'Role': { th: 'ระดับสิทธิ์' },
    'Admin': { th: 'แอดมิน' },
    'Employee': { th: 'พนักงาน' },

    // Attendance
    'Date': { th: 'วันที่' },
    'In': { th: 'เข้า' },
    'Out': { th: 'ออก' },
    'Hours': { th: 'ชั่วโมง' },
    'Method': { th: 'วิธี' },
    'Filter': { th: 'กรอง' },
    'No attendance records': { th: 'ยังไม่มีบันทึกการเข้างาน' },
    'Export CSV': { th: 'ส่งออก CSV' },

    // Profile
    'My Profile': { th: 'โปรไฟล์ของฉัน' },
    'Edit profile': { th: 'แก้ไขโปรไฟล์' },
    'Change password': { th: 'เปลี่ยนรหัสผ่าน' },
    'Current password': { th: 'รหัสผ่านปัจจุบัน' },
    'New password': { th: 'รหัสผ่านใหม่' },
    'Account': { th: 'บัญชี' },
    'Company': { th: 'บริษัท' },

    // Settings
    'Company Settings': { th: 'ตั้งค่าบริษัท' },
    'Work hours': { th: 'เวลาทำงาน' },
    'Work start': { th: 'เวลาเริ่มงาน' },
    'Work end': { th: 'เวลาเลิกงาน' },
    'Late grace period (min)': { th: 'ผ่อนผันเวลาสาย (นาที)' },
    'Office location': { th: 'ตำแหน่งออฟฟิศ' },
    'Latitude': { th: 'ละติจูด' },
    'Longitude': { th: 'ลองจิจูด' },
    'Allowed radius (m)': { th: 'รัศมีที่อนุญาต (เมตร)' },
    'Use my current location': { th: 'ใช้ตำแหน่งปัจจุบันของฉัน' },
    'Allowed check-in methods': { th: 'วิธีเช็คอินที่อนุญาต' },
    'Allow GPS check-in': { th: 'เปิดการเช็คอินด้วย GPS' },
    'Allow QR check-in': { th: 'เปิดการเช็คอินด้วย QR' },
    'Leave defaults (days/year)': { th: 'จำนวนวันลาเริ่มต้น (ต่อปี)' },
    'Subscription': { th: 'สมาชิกรายเดือน' },
    'Current plan': { th: 'แพ็คเกจปัจจุบัน' },
    'Trial': { th: 'ทดลองใช้' },
    'Upgrade': { th: 'อัพเกรด' },
    'Trial ends in': { th: 'ทดลองใช้เหลือ' },
    'Manage subscription': { th: 'จัดการสมาชิก' },
    'Settings saved': { th: 'บันทึกการตั้งค่าแล้ว' },
    'Language': { th: 'ภาษา' },
    'About': { th: 'เกี่ยวกับ' },
    'Danger zone': { th: 'โซนอันตราย' },
    'Reset all data': { th: 'ล้างข้อมูลทั้งหมด' },
    'This will delete all companies, users, leaves, and check-ins from this device. This cannot be undone.': { th: 'จะลบข้อมูลทั้งหมดของอุปกรณ์นี้ ทั้งบริษัท พนักงาน การลา และการเช็คอิน ลบแล้วกู้คืนไม่ได้' },

    // Misc
    '14-day free trial. No card required.': { th: 'ทดลองใช้ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต' },
    'View my records': { th: 'ดูบันทึกของฉัน' },
    'Admin only': { th: 'เฉพาะแอดมินเท่านั้น' },
    'Records': { th: 'รายการ' },
    'Removed': { th: 'ลบแล้ว' },
    'Added': { th: 'เพิ่มแล้ว' },
    'CSV exported': { th: 'ส่งออก CSV แล้ว' },
    'Location set': { th: 'ตั้งตำแหน่งแล้ว' },
    'Upgraded to Pro!': { th: 'อัพเกรดเป็น Pro แล้ว!' },
    'Manual check-in records time without verification. Use only when other methods are unavailable.': { th: 'การบันทึกเองจะไม่มีการตรวจสอบ ใช้เฉพาะกรณีวิธีอื่นใช้ไม่ได้' },
    'Hint': { th: 'คำใบ้' },
    'Cancel this request?': { th: 'ยกเลิกคำขอนี้?' },
    'Remove this employee?': { th: 'ลบพนักงานคนนี้?' },
    'In the demo, plans are simulated. Upgrade to Pro?': { th: 'ในเวอร์ชันทดลอง การอัพเกรดเป็นการจำลอง อัพเกรดเป็น Pro?' },
    'Version': { th: 'เวอร์ชัน' },
    'Created': { th: 'สร้างเมื่อ' },
    'Or add directly': { th: 'หรือเพิ่มโดยตรง' },
    'Temporary password': { th: 'รหัสผ่านชั่วคราว' },
    'Search employees': { th: 'ค้นหาพนักงาน' },
    'GPS not available': { th: 'ใช้ GPS ไม่ได้' },

    // Shifts
    'Shifts': { th: 'กะการทำงาน' },
    'Shift': { th: 'กะ' },
    'Select shift': { th: 'เลือกกะ' },
    'Add shift': { th: 'เพิ่มกะ' },
    'Edit shift': { th: 'แก้ไขกะ' },
    'Shift name': { th: 'ชื่อกะ' },
    'Start time': { th: 'เวลาเริ่ม' },
    'End time': { th: 'เวลาเลิก' },
    'No shifts yet': { th: 'ยังไม่มีกะ' },
    'Add shifts to let employees pick when they check in': { th: 'เพิ่มกะเพื่อให้พนักงานเลือกตอนเช็คอิน' },
    'Morning shift': { th: 'กะเช้า' },
    'Afternoon shift': { th: 'กะบ่าย' },
    'Night shift': { th: 'กะดึก' },
    'Day shift': { th: 'กะกลางวัน' },
    'Add default shifts': { th: 'เพิ่มกะมาตรฐาน' },
    'Remove this shift?': { th: 'ลบกะนี้?' },
    'No shift': { th: 'ไม่มีกะ' },
    'Please select a shift first': { th: 'กรุณาเลือกกะก่อน' },

    // Employee code / login
    'Employee Code': { th: 'รหัสพนักงาน' },
    'Employee code': { th: 'รหัสพนักงาน' },
    'Code': { th: 'รหัส' },
    'Password / Employee Code': { th: 'รหัสผ่าน / รหัสพนักงาน' },
    'Get your code from your admin': { th: 'รับรหัสจากแอดมินบริษัทคุณ' },
    'Login details': { th: 'ข้อมูลเข้าระบบ' },
    'Share email + code with employee to let them log in': { th: 'ส่งอีเมล + รหัสนี้ให้พนักงานเพื่อให้ login ได้' },
    'Reset code': { th: 'รีเซ็ตรหัส' },
    'Code reset': { th: 'รีเซ็ตรหัสแล้ว' },
    'New code': { th: 'รหัสใหม่' },
    'This code is already used by another employee': { th: 'รหัสนี้ถูกใช้แล้วโดยพนักงานคนอื่น' },
    'Quick login': { th: 'เข้าระบบเร็ว' },
    'Email login': { th: 'เข้าระบบด้วยอีเมล' },
    'Company code': { th: 'รหัสบริษัท' },
    'Enter the company join code': { th: 'กรอกรหัสบริษัท' },
    'For employees': { th: 'สำหรับพนักงาน' },
    'For admins': { th: 'สำหรับแอดมิน' },
    'Multiple employees share this code — please ask your admin to fix': { th: 'มีพนักงานหลายคนใช้รหัสนี้ — กรุณาแจ้งแอดมิน' },
    'Company not found': { th: 'ไม่พบบริษัทนี้' },
    'Code not found in this company': { th: 'ไม่พบรหัสนี้ในบริษัท' },

    // Profile picture
    'Profile picture': { th: 'รูปโปรไฟล์' },
    'Change picture': { th: 'เปลี่ยนรูป' },
    'Remove picture': { th: 'ลบรูป' },
    'Picture updated': { th: 'อัพเดทรูปแล้ว' },
    'Picture too large': { th: 'รูปใหญ่เกินไป' },

    // Schedule
    'Schedule': { th: 'ตารางการทำงาน' },
    'My Schedule': { th: 'ตารางของฉัน' },
    'Team Schedule': { th: 'ตารางทีม' },
    'No schedule': { th: 'ไม่มีตาราง' },
    'Off': { th: 'หยุด' },
    'Day off': { th: 'วันหยุด' },
    'Assign shift': { th: 'จัดกะ' },
    'Clear shift': { th: 'ยกเลิกกะ' },
    'Select date': { th: 'เลือกวันที่' },
    'Tap an employee to assign their shift for this day': { th: 'แตะที่ชื่อพนักงานเพื่อจัดกะของวันนี้' },
    'Tap a day to see details': { th: 'แตะวันที่เพื่อดูรายละเอียด' },
    'This week': { th: 'สัปดาห์นี้' },
    'Next week': { th: 'สัปดาห์หน้า' },
    'Previous week': { th: 'สัปดาห์ที่แล้ว' },
    'Week of': { th: 'สัปดาห์ของ' },
    'Mon': { th: 'จ.' },
    'Tue': { th: 'อ.' },
    'Wed': { th: 'พ.' },
    'Thu': { th: 'พฤ.' },
    'Fri': { th: 'ศ.' },
    'Sat': { th: 'ส.' },
    'Sun': { th: 'อา.' },
    'Monday': { th: 'จันทร์' },
    'Tuesday': { th: 'อังคาร' },
    'Wednesday': { th: 'พุธ' },
    'Thursday': { th: 'พฤหัสบดี' },
    'Friday': { th: 'ศุกร์' },
    'Saturday': { th: 'เสาร์' },
    'Sunday': { th: 'อาทิตย์' },

    // Meetings
    'Meetings': { th: 'การประชุม' },
    'Meeting': { th: 'ประชุม' },
    'New meeting': { th: 'นัดประชุมใหม่' },
    'Schedule meeting': { th: 'นัดประชุม' },
    'Edit meeting': { th: 'แก้ไขนัดประชุม' },
    'Meeting title': { th: 'หัวข้อประชุม' },
    'Location': { th: 'สถานที่' },
    'Location or link': { th: 'สถานที่ / ลิงก์' },
    'Attendees': { th: 'ผู้เข้าร่วม' },
    'Select attendees': { th: 'เลือกผู้เข้าร่วม' },
    'Notes': { th: 'หมายเหตุ' },
    'No meetings yet': { th: 'ยังไม่มีการประชุม' },
    'Upcoming meetings': { th: 'การประชุมที่จะมาถึง' },
    'Past meetings': { th: 'การประชุมที่ผ่านไป' },
    'Today\'s shift': { th: 'กะวันนี้' },
    'Today\'s meetings': { th: 'ประชุมวันนี้' },
    'Delete meeting': { th: 'ลบนัดประชุม' },
    'Created by': { th: 'สร้างโดย' },
    'people': { th: 'คน' },
    'Select all': { th: 'เลือกทั้งหมด' },
    'Deselect all': { th: 'ยกเลิกการเลือก' },
    'You must select at least one attendee': { th: 'ต้องเลือกผู้เข้าร่วมอย่างน้อย 1 คน' },

    // Demo + Backup
    'Try with demo data': { th: 'ลองด้วยข้อมูลตัวอย่าง' },
    'Backup & restore': { th: 'สำรอง & คืนข้อมูล' },
    'Export all data as a JSON file. Import on another browser to transfer everything.': { th: 'ส่งออกข้อมูลทั้งหมดเป็นไฟล์ JSON นำเข้าใน browser อื่นเพื่อย้ายข้อมูลทั้งหมด' },
    'Export': { th: 'ส่งออก' },
    'Import': { th: 'นำเข้า' },
    'Exported': { th: 'ส่งออกแล้ว' },

    // Errors
    'Invalid email or password': { th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
    'Email already exists': { th: 'อีเมลนี้มีอยู่แล้ว' },
    'Invalid join code': { th: 'รหัสบริษัทไม่ถูกต้อง' },
    'Please fill in all fields': { th: 'กรุณากรอกข้อมูลให้ครบ' },
    'Password too short': { th: 'รหัสผ่านสั้นเกินไป' },
    'End date must be after start date': { th: 'วันสิ้นสุดต้องอยู่หลังวันเริ่มต้น' }
  },

  lang: 'th',

  init() {
    this.lang = DB.get(DB.K.LANG, 'th');
    this.apply();
    this.injectToggle();
  },

  set(lang) {
    if (this.lang === lang) return;
    this.lang = lang;
    DB.set(DB.K.LANG, lang);
    // Full reload — many strings are inlined into render() templates,
    // so a quick reload guarantees full re-translation.
    location.reload();
  },

  t(key) {
    if (this.lang === 'en') return key;
    const entry = this.dict[key];
    if (!entry) return key;
    return entry[this.lang] || key;
  },

  apply() {
    // Translate text nodes that have data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.setAttribute('placeholder', this.t(key));
    });
    // HTML lang attribute
    document.documentElement.lang = this.lang;
  },

  injectToggle() {
    // Skip if already exists
    if (document.querySelector('.lang-toggle')) return;
    const target = document.querySelector('[data-lang-slot]');
    if (!target) return;
    const wrap = document.createElement('div');
    wrap.className = 'lang-toggle';
    wrap.innerHTML = `
      <button data-lang="th" class="${this.lang === 'th' ? 'active' : ''}">TH</button>
      <button data-lang="en" class="${this.lang === 'en' ? 'active' : ''}">EN</button>
    `;
    wrap.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => this.set(b.dataset.lang));
    });
    target.appendChild(wrap);
  }
};

window.I18N = I18N;

// Auto-init on DOM ready (works even on pages that don't load ui.js)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => I18N.init());
} else {
  I18N.init();
}
