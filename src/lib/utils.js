/** Generate a random alphanumeric code of given length */
export function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Haversine distance in metres between two lat/lng points */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Format a date as "26 พ.ค. 2568" (Thai short) or "26 May 2025" */
export function formatDate(dateStr, locale = 'th-TH') {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/** Format a timestamptz as "08:45" */
export function formatTime(isoStr) {
  if (!isoStr) return '-'
  return new Date(isoStr).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/** "2025-05-26" → Date object at local midnight */
export function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Date → "2025-05-26" */
export function toDateString(date = new Date()) {
  return date.toISOString().split('T')[0]
}

/** Days between two date strings */
export function daysBetween(start, end) {
  const ms = parseLocalDate(end) - parseLocalDate(start)
  return Math.round(ms / 86400000) + 1
}

/** Suggest next employee code given existing list */
export function suggestEmployeeCode(existing = []) {
  const nums = existing
    .map(c => parseInt(c.replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `EMP${String(next).padStart(3, '0')}`
}

/** Thai greeting based on hour */
export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'อรุณสวัสดิ์'
  if (h < 17) return 'สวัสดีตอนบ่าย'
  return 'สวัสดีตอนเย็น'
}

/** Plan limits */
export const PLAN_LIMITS = {
  trial:    { employees: 3,         csvExport: false, label: 'ทดลองใช้',  price: 0 },
  starter:  { employees: 10,        csvExport: false, label: 'Starter',   price: 490 },
  pro:      { employees: 50,        csvExport: true,  label: 'Pro',        price: 1490 },
  business: { employees: Infinity,  csvExport: true,  label: 'Business',   price: 3490 },
}

export function planLabel(plan) {
  return PLAN_LIMITS[plan]?.label ?? plan
}

/** Export array-of-objects to CSV download */
export function downloadCSV(rows, filename = 'export.csv') {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

/** Clamp a number */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
