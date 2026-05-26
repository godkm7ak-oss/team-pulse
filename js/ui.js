// TeamPulse — Shared UI helpers (nav, toast, auth guard)

const UI = {
  // ===== Auth guard =====
  requireAuth() {
    const session = DB.getSession();
    if (!session) {
      window.location.href = 'auth.html';
      return null;
    }
    const user = DB.getUser(session.userId);
    const company = DB.getCompany(session.companyId);
    if (!user || !company) {
      DB.clearSession();
      window.location.href = 'auth.html';
      return null;
    }
    return { user, company };
  },

  requireAdmin() {
    const ctx = this.requireAuth();
    if (!ctx) return null;
    if (ctx.user.role !== 'admin') {
      this.toast(I18N.t('Admin only'), 'error');
      setTimeout(() => window.location.href = 'dashboard.html', 800);
      return null;
    }
    return ctx;
  },

  // ===== Toast =====
  toast(msg, type) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.2s';
      setTimeout(() => el.remove(), 200);
    }, 2400);
  },

  // ===== Modal =====
  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
  },
  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  },

  // ===== Bottom nav =====
  renderBottomNav(activePage, role) {
    // 5 tabs for both roles. Admin-only stuff (Team, Settings) lives in the
    // Profile page, which acts as the "More" menu.
    const tabs = [
      { id: 'dashboard', file: 'dashboard.html', label: 'Dashboard', icon: '🏠' },
      { id: 'schedule', file: 'schedule.html', label: 'Schedule', icon: '📅' },
      { id: 'checkin', file: 'checkin.html', label: 'Check In', icon: '⏱', highlight: true },
      { id: 'leave', file: 'leave.html', label: 'Leave', icon: '🏖️' },
      { id: 'profile', file: 'profile.html', label: 'Profile', icon: '👤' }
    ];

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = tabs.map(t => `
      <a href="${t.file}" class="${activePage === t.id ? 'active' : ''} ${t.highlight ? 'checkin-tab' : ''}">
        <span class="icon">${t.icon}</span>
        <span data-i18n="${t.label}">${I18N.t(t.label)}</span>
      </a>
    `).join('');
    document.body.appendChild(nav);
  },

  // ===== Header =====
  renderHeader(title, opts) {
    opts = opts || {};
    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = `
      <div>
        <h1 data-i18n="${title}">${I18N.t(title)}</h1>
        ${opts.subtitle ? `<div class="sub" data-i18n="${opts.subtitle}">${I18N.t(opts.subtitle)}</div>` : ''}
      </div>
      <div class="header-actions" data-lang-slot>
        ${opts.action ? opts.action : ''}
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
  },

  // ===== Avatar initials =====
  initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  },

  avatarEl(user, size) {
    const cls = size ? ' ' + size : '';
    if (user && user.avatar) {
      return `<div class="avatar${cls}" style="background-image: url('${user.avatar}'); background-size: cover; background-position: center;"></div>`;
    }
    const color = (user && user.avatarColor) || '#3B4FCA';
    return `<div class="avatar${cls}" style="background: linear-gradient(135deg, ${color}, ${this.shade(color, -20)})">${this.initials(user ? user.name : '')}</div>`;
  },

  shade(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0xff) + percent;
    let b = (num & 0xff) + percent;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  },

  // ===== Greeting =====
  greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  },

  // ===== Status badge =====
  statusBadge(status) {
    const map = {
      pending: { cls: 'badge-warning', label: 'Pending' },
      approved: { cls: 'badge-success', label: 'Approved' },
      rejected: { cls: 'badge-danger', label: 'Rejected' }
    };
    const m = map[status] || { cls: 'badge-gray', label: status };
    return `<span class="badge ${m.cls}" data-i18n="${m.label}">${I18N.t(m.label)}</span>`;
  },

  leaveTypeBadge(type) {
    const map = {
      annual: { cls: 'badge-cyan', label: 'Annual leave' },
      sick: { cls: 'badge-danger', label: 'Sick leave' },
      personal: { cls: 'badge-primary', label: 'Personal leave' },
      emergency: { cls: 'badge-warning', label: 'Emergency leave' }
    };
    const m = map[type] || { cls: 'badge-gray', label: type };
    return `<span class="badge ${m.cls}" data-i18n="${m.label}">${I18N.t(m.label)}</span>`;
  },

  // ===== Confirm =====
  confirm(msg, onYes) {
    if (window.confirm(msg)) onYes();
  }
};

window.UI = UI;
// (i18n auto-init now lives in i18n.js)
