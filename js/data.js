// TeamPulse — Data Layer (localStorage)

const DB = {
  K: {
    COMPANIES: 'tp-companies',
    USERS: 'tp-users',
    LEAVES: 'tp-leaves',
    CHECKINS: 'tp-checkins',
    SCHEDULES: 'tp-schedules',
    MEETINGS: 'tp-meetings',
    SESSION: 'tp-session',
    LANG: 'tp-lang'
  },

  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  uid(prefix) {
    return prefix + '_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  },

  // ===== Companies =====
  getCompanies() { return this.get(this.K.COMPANIES, []); },
  saveCompanies(arr) { this.set(this.K.COMPANIES, arr); },

  getCompany(id) {
    return this.getCompanies().find(c => c.id === id);
  },

  getCompanyByCode(code) {
    return this.getCompanies().find(c => c.joinCode.toUpperCase() === code.toUpperCase());
  },

  saveCompany(company) {
    const list = this.getCompanies();
    const i = list.findIndex(c => c.id === company.id);
    if (i >= 0) list[i] = company; else list.push(company);
    this.saveCompanies(list);
  },

  createCompany(name, adminEmail) {
    const code = name.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() ||
                 'CO' + Math.random().toString(36).slice(2, 4).toUpperCase();
    const company = {
      id: this.uid('co'),
      name,
      joinCode: code + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      adminEmail,
      plan: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      workStart: '09:00',
      workEnd: '18:00',
      lateGraceMinutes: 5,
      officeLat: 13.7563,
      officeLng: 100.5018,
      officeRadiusM: 200,
      checkInMethods: ['gps', 'qr'],
      qrSecret: Math.random().toString(36).slice(2, 10).toUpperCase(),
      annualLeaveDefault: 12,
      sickLeaveDefault: 30,
      personalLeaveDefault: 7,
      emergencyLeaveDefault: 5,
      currency: 'THB',
      shifts: []  // [{ id, name, start: 'HH:MM', end: 'HH:MM', color }]
    };
    this.saveCompany(company);
    return company;
  },

  // Shift helpers
  getShift(company, shiftId) {
    if (!shiftId) return null;
    return (company.shifts || []).find(s => s.id === shiftId) || null;
  },

  guessShiftForTime(company, dateIso) {
    const shifts = company.shifts || [];
    if (shifts.length === 0) return null;
    const d = dateIso ? new Date(dateIso) : new Date();
    const mins = d.getHours() * 60 + d.getMinutes();
    // Find shift whose start time is closest before now (handles overnight shifts too)
    let best = null;
    let bestDiff = Infinity;
    shifts.forEach(s => {
      const [sh, sm] = s.start.split(':').map(Number);
      const startMins = sh * 60 + sm;
      // Distance considering circular 24h
      let diff = mins - startMins;
      if (diff < 0) diff += 24 * 60;
      if (diff < bestDiff) {
        bestDiff = diff;
        best = s;
      }
    });
    return best;
  },

  // ===== Users =====
  getUsers() { return this.get(this.K.USERS, []); },
  saveUsers(arr) { this.set(this.K.USERS, arr); },

  getUser(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUsersByCompany(companyId) {
    return this.getUsers().filter(u => u.companyId === companyId);
  },

  saveUser(user) {
    const list = this.getUsers();
    const i = list.findIndex(u => u.id === user.id);
    if (i >= 0) list[i] = user; else list.push(user);
    this.saveUsers(list);
  },

  deleteUser(id) {
    const list = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(list);
  },

  createUser({ companyId, email, password, name, role, position, department, phone }) {
    const user = {
      id: this.uid('u'),
      companyId,
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'employee',
      position: position || '',
      department: department || '',
      phone: phone || '',
      hireDate: new Date().toISOString().slice(0, 10),
      avatarColor: this.randomAvatarColor(),
      createdAt: new Date().toISOString()
    };
    this.saveUser(user);
    return user;
  },

  randomAvatarColor() {
    const colors = ['#3B4FCA', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // ===== Leaves =====
  getLeaves() { return this.get(this.K.LEAVES, []); },
  saveLeaves(arr) { this.set(this.K.LEAVES, arr); },

  getLeavesByCompany(companyId) {
    return this.getLeaves().filter(l => l.companyId === companyId);
  },

  getLeavesByUser(userId) {
    return this.getLeaves().filter(l => l.userId === userId);
  },

  saveLeave(leave) {
    const list = this.getLeaves();
    const i = list.findIndex(l => l.id === leave.id);
    if (i >= 0) list[i] = leave; else list.push(leave);
    this.saveLeaves(list);
  },

  deleteLeave(id) {
    this.saveLeaves(this.getLeaves().filter(l => l.id !== id));
  },

  createLeave({ companyId, userId, type, startDate, endDate, reason }) {
    const days = this.diffDaysInclusive(startDate, endDate);
    const leave = {
      id: this.uid('lv'),
      companyId,
      userId,
      type,
      startDate,
      endDate,
      days,
      reason: reason || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: ''
    };
    this.saveLeave(leave);
    return leave;
  },

  // ===== Check-ins =====
  getCheckins() { return this.get(this.K.CHECKINS, []); },
  saveCheckins(arr) { this.set(this.K.CHECKINS, arr); },

  getCheckinsByCompany(companyId) {
    return this.getCheckins().filter(c => c.companyId === companyId);
  },

  getCheckinsByUser(userId) {
    return this.getCheckins().filter(c => c.userId === userId);
  },

  getTodayCheckin(userId) {
    const today = new Date().toISOString().slice(0, 10);
    return this.getCheckins().find(c => c.userId === userId && c.date === today);
  },

  saveCheckin(ci) {
    const list = this.getCheckins();
    const i = list.findIndex(c => c.id === ci.id);
    if (i >= 0) list[i] = ci; else list.push(ci);
    this.saveCheckins(list);
  },

  // ===== Schedules (work shift assignments) =====
  // entry: { id, companyId, userId, date: 'YYYY-MM-DD', shiftId }
  getSchedules() { return this.get(this.K.SCHEDULES, []); },
  saveSchedules(arr) { this.set(this.K.SCHEDULES, arr); },

  getSchedulesByCompany(companyId) {
    return this.getSchedules().filter(s => s.companyId === companyId);
  },

  getSchedulesByUser(userId) {
    return this.getSchedules().filter(s => s.userId === userId);
  },

  getScheduleForUserOnDate(userId, dateStr) {
    return this.getSchedules().find(s => s.userId === userId && s.date === dateStr) || null;
  },

  // Upsert a single (user, date) → shift assignment. Pass null shiftId to clear.
  setScheduleAssignment(companyId, userId, date, shiftId) {
    const list = this.getSchedules();
    const i = list.findIndex(s => s.userId === userId && s.date === date);
    if (!shiftId) {
      if (i >= 0) list.splice(i, 1);
    } else if (i >= 0) {
      list[i].shiftId = shiftId;
    } else {
      list.push({ id: this.uid('sc'), companyId, userId, date, shiftId });
    }
    this.saveSchedules(list);
  },

  // ===== Meetings =====
  getMeetings() { return this.get(this.K.MEETINGS, []); },
  saveMeetings(arr) { this.set(this.K.MEETINGS, arr); },

  saveMeeting(m) {
    const list = this.getMeetings();
    const i = list.findIndex(x => x.id === m.id);
    if (i >= 0) list[i] = m; else list.push(m);
    this.saveMeetings(list);
  },

  deleteMeeting(id) {
    this.saveMeetings(this.getMeetings().filter(m => m.id !== id));
  },

  createMeeting({ companyId, title, date, startTime, endTime, location, attendeeIds, notes, createdBy }) {
    const m = {
      id: this.uid('mt'),
      companyId,
      title: title || '',
      date,
      startTime: startTime || '09:00',
      endTime: endTime || '10:00',
      location: location || '',
      attendeeIds: attendeeIds || [],
      notes: notes || '',
      createdBy,
      createdAt: new Date().toISOString()
    };
    this.saveMeeting(m);
    return m;
  },

  getMeetingsByCompany(companyId) {
    return this.getMeetings().filter(m => m.companyId === companyId);
  },

  // Meetings where the user is either creator or attendee
  getMeetingsForUser(user) {
    return this.getMeetings().filter(m =>
      m.companyId === user.companyId &&
      (m.createdBy === user.id || (m.attendeeIds || []).includes(user.id))
    );
  },

  getUpcomingMeetings(user, limit) {
    const today = new Date().toISOString().slice(0, 10);
    return this.getMeetingsForUser(user)
      .filter(m => m.date >= today)
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
      .slice(0, limit || 100);
  },

  // ===== Login & code helpers =====

  // True if no other user in this company has the same code (case-insensitive)
  isCodeUnique(companyId, code, excludeUserId) {
    if (!code) return false;
    const target = String(code).toLowerCase();
    return !this.getUsersByCompany(companyId).some(u =>
      String(u.password || '').toLowerCase() === target && u.id !== excludeUserId
    );
  },

  // Find user by company join code + employee code (quick employee login)
  findUserByCodeLogin(joinCode, employeeCode) {
    const cleanJoin = String(joinCode || '').trim();
    const cleanCode = String(employeeCode || '').trim();
    const company = this.getCompanyByCode(cleanJoin);
    if (!company) {
      return { error: 'company', debug: { tried: cleanJoin, total: this.getCompanies().length } };
    }
    const all = this.getUsersByCompany(company.id);
    const target = cleanCode.toLowerCase();
    const matches = all.filter(u =>
      String(u.password || '').trim().toLowerCase() === target
    );
    if (matches.length === 0) {
      return { error: 'code', debug: { tried: cleanCode, totalUsers: all.length, codes: all.map(u => u.password) } };
    }
    if (matches.length > 1) return { error: 'duplicate', company };
    return { user: matches[0], company };
  },

  // ===== Image helpers =====
  // Resize an image file and call back with a JPEG data URL — keeps localStorage small.
  resizeImageFile(file, maxSize, callback) {
    if (!file || !file.type || file.type.indexOf('image') !== 0) {
      callback(null); return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxSize) { h = h * maxSize / w; w = maxSize; }
        else if (h >= w && h > maxSize) { w = w * maxSize / h; h = maxSize; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => callback(null);
      img.src = e.target.result;
    };
    reader.onerror = () => callback(null);
    reader.readAsDataURL(file);
  },

  // ===== Demo seed =====
  seedDemo() {
    // Create a demo company
    const company = this.createCompany('Demo Hotel Bangkok', 'admin@demo.com');
    company.shifts = [
      { id: this.uid('sh'), name: 'กะเช้า', start: '06:00', end: '14:00', color: '#0EA5E9' },
      { id: this.uid('sh'), name: 'กะบ่าย', start: '14:00', end: '22:00', color: '#F59E0B' },
      { id: this.uid('sh'), name: 'กะดึก', start: '22:00', end: '06:00', color: '#8B5CF6' }
    ];
    this.saveCompany(company);

    // Admin
    const admin = this.createUser({
      companyId: company.id, email: 'admin@demo.com', password: 'demo1234',
      name: 'Khun Admin', role: 'admin', position: 'General Manager', department: 'Management'
    });

    // Employees
    const employees = [
      { name: 'สมชาย ใจดี', email: 'somchai@demo.com', position: 'Front Officer', department: 'Front Office', code: 'EMP001' },
      { name: 'นภา รักงาน', email: 'napa@demo.com', position: 'Front Officer', department: 'Front Office', code: 'EMP002' },
      { name: 'วิชัย ตั้งใจ', email: 'wichai@demo.com', position: 'Housekeeping', department: 'Housekeeping', code: 'EMP003' },
      { name: 'มาลี สวยงาม', email: 'malee@demo.com', position: 'Chef', department: 'F&B', code: 'EMP004' },
      { name: 'ปกรณ์ ขยัน', email: 'pakorn@demo.com', position: 'Security', department: 'Security', code: 'EMP005' }
    ];
    const createdEmployees = employees.map(e => this.createUser({
      companyId: company.id, email: e.email, password: e.code, name: e.name,
      role: 'employee', position: e.position, department: e.department
    }));

    // Schedule for current week (Mon-Sun)
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
    monday.setHours(0, 0, 0, 0);

    const shifts = company.shifts;
    const schedules = [];
    createdEmployees.forEach((emp, empIdx) => {
      for (let day = 0; day < 7; day++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + day);
        const dateStr = d.toISOString().slice(0, 10);
        // Day off on Sunday for some, Saturday for others
        if (day === 6 && empIdx % 2 === 0) continue;
        if (day === 5 && empIdx % 2 === 1) continue;
        // Rotate shift: employee gets a different shift each day
        const shiftIdx = (empIdx + day) % shifts.length;
        schedules.push({
          id: this.uid('sc'),
          companyId: company.id,
          userId: emp.id,
          date: dateStr,
          shiftId: shifts[shiftIdx].id
        });
      }
    });
    const existingSchedules = this.getSchedules();
    this.saveSchedules(existingSchedules.concat(schedules));

    // Meetings — one for today, one for tomorrow
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
    this.createMeeting({
      companyId: company.id,
      title: 'ประชุมประจำสัปดาห์',
      date: todayStr,
      startTime: '10:00',
      endTime: '11:00',
      location: 'Conference Room A',
      notes: 'รีวิวงานสัปดาห์ที่ผ่านมา + แผนสัปดาห์หน้า',
      attendeeIds: [admin.id].concat(createdEmployees.slice(0, 3).map(u => u.id)),
      createdBy: admin.id
    });
    this.createMeeting({
      companyId: company.id,
      title: 'อบรมการให้บริการลูกค้า',
      date: tomorrowStr,
      startTime: '14:00',
      endTime: '16:00',
      location: 'Training Room',
      notes: 'อบรมพนักงาน Front Office ทุกคน',
      attendeeIds: createdEmployees.slice(0, 2).map(u => u.id).concat([admin.id]),
      createdBy: admin.id
    });

    // A pending leave request to test approval flow
    this.createLeave({
      companyId: company.id,
      userId: createdEmployees[1].id,
      type: 'annual',
      startDate: new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(today.getTime() + 9 * 86400000).toISOString().slice(0, 10),
      reason: 'เดินทางกลับบ้านต่างจังหวัด'
    });

    // Auto-login as admin
    this.setSession({ userId: admin.id, companyId: company.id, role: 'admin' });

    return { company, admin, employees: createdEmployees };
  },

  // ===== Export / Import =====
  exportAll() {
    const data = {};
    Object.values(this.K).forEach(key => {
      const v = localStorage.getItem(key);
      if (v !== null) data[key] = v;
    });
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      data
    };
  },

  importAll(payload) {
    if (!payload || !payload.data) throw new Error('Invalid backup file');
    Object.keys(payload.data).forEach(key => {
      // Only restore keys we know about (defence-in-depth)
      if (Object.values(this.K).includes(key)) {
        localStorage.setItem(key, payload.data[key]);
      }
    });
  },

  // ===== Session =====
  getSession() { return this.get(this.K.SESSION, null); },
  setSession(s) { this.set(this.K.SESSION, s); },
  clearSession() { localStorage.removeItem(this.K.SESSION); },

  // ===== Utilities =====
  diffDaysInclusive(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const ms = e.getTime() - s.getTime();
    return Math.max(1, Math.floor(ms / 86400000) + 1);
  },

  formatDate(iso, locale) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const lang = locale || (DB.get(DB.K.LANG, 'th'));
    return d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  formatTime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d)) return '-';
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  },

  // Calculate leave used by user this year
  getLeaveBalance(userId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const company = this.getCompany(user.companyId);
    if (!company) return null;

    const year = new Date().getFullYear();
    const leaves = this.getLeavesByUser(userId).filter(l =>
      l.status === 'approved' && new Date(l.startDate).getFullYear() === year
    );

    const used = { annual: 0, sick: 0, personal: 0, emergency: 0 };
    leaves.forEach(l => { used[l.type] = (used[l.type] || 0) + l.days; });

    return {
      annual: { used: used.annual, total: company.annualLeaveDefault },
      sick: { used: used.sick, total: company.sickLeaveDefault },
      personal: { used: used.personal, total: company.personalLeaveDefault },
      emergency: { used: used.emergency, total: company.emergencyLeaveDefault }
    };
  },

  // Distance calculation (Haversine) in metres
  haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  // Calculate late minutes vs company workStart
  calcLateMinutes(checkInIso, workStart, graceMin) {
    const ci = new Date(checkInIso);
    const [h, m] = workStart.split(':').map(Number);
    const expected = new Date(ci);
    expected.setHours(h, m, 0, 0);
    const diffMin = Math.floor((ci.getTime() - expected.getTime()) / 60000);
    const grace = graceMin || 0;
    return diffMin > grace ? diffMin : 0;
  }
};

// Make globally available
window.DB = DB;
