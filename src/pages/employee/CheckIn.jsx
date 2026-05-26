import { useEffect, useRef, useState } from 'react'
import { MapPin, CheckCircle, XCircle, Loader2, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { haversineDistance, formatTime, toDateString } from '../../lib/utils'

export default function CheckIn() {
  const { profile, company } = useAuth()
  const toast = useToast()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const [todayRecord, setTodayRecord] = useState(undefined)
  const [gpsStatus, setGpsStatus] = useState('idle') // idle | locating | inside | outside | error
  const [distance, setDistance] = useState(null)
  const [cachedPos, setCachedPos] = useState(null)
  const [loading, setLoading] = useState(false)

  const offLat = company?.office_lat || 13.7563
  const offLng = company?.office_lng || 100.5018
  const radius  = company?.office_radius_m || 200

  useEffect(() => {
    loadToday()
  }, [profile])

  useEffect(() => {
    if (!mapRef.current || typeof window.L === 'undefined') return
    initMap()
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }
    }
  }, [mapRef.current])

  async function loadToday() {
    if (!profile) return
    const today = toDateString()
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', profile.id)
      .gte('check_in_at', `${today}T00:00:00`)
      .lte('check_in_at', `${today}T23:59:59`)
      .maybeSingle()
    setTodayRecord(data)
  }

  function initMap() {
    const L = window.L
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([offLat, offLng], 16)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)

    // Office marker
    const offIcon = L.divIcon({
      className: '',
      html: `<div style="background:#3B4FCA;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.2)">🏢</div>`,
      iconSize: [34, 34], iconAnchor: [17, 17],
    })
    L.marker([offLat, offLng], { icon: offIcon }).addTo(map)

    // Radius circle
    L.circle([offLat, offLng], {
      radius, color: '#3B4FCA', fillColor: '#3B4FCA', fillOpacity: 0.08,
      weight: 2, dashArray: '6 4',
    }).addTo(map)

    // Auto-locate user
    setGpsStatus('locating')
    map.locate({ setView: false, enableHighAccuracy: true, maximumAge: 10000 })

    map.on('locationfound', e => {
      const { lat, lng } = e.latlng
      const pos = { lat, lng, ts: Date.now() }
      setCachedPos(pos)

      const dist = Math.round(haversineDistance(lat, lng, offLat, offLng))
      setDistance(dist)
      const inside = dist <= radius
      setGpsStatus(inside ? 'inside' : 'outside')

      const userIcon = L.divIcon({
        className: '',
        html: `<div style="background:${inside ? '#22c55e' : '#ef4444'};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid white">📍</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      })
      L.marker([lat, lng], { icon: userIcon }).addTo(map)

      const group = L.featureGroup([L.marker([offLat, offLng]), L.marker([lat, lng])])
      map.fitBounds(group.getBounds().pad(0.3))

      setTimeout(() => map.invalidateSize(), 100)
    })

    map.on('locationerror', () => {
      setGpsStatus('error')
      setTimeout(() => map.invalidateSize(), 100)
    })

    setTimeout(() => map.invalidateSize(), 150)
  }

  async function handleCheckIn() {
    if (gpsStatus !== 'inside' && gpsStatus !== 'outside') return
    if (gpsStatus === 'outside') {
      toast({ message: `อยู่นอกรัศมี ${distance}m (สูงสุด ${radius}m)`, type: 'error' })
      return
    }

    setLoading(true)
    try {
      const now = new Date()
      const workStart = new Date(now)
      workStart.setHours(9, 0, 0, 0)
      const isLate = now > workStart

      const { error } = await supabase.from('attendance').insert({
        employee_id: profile.id,
        company_id: company.id,
        check_in_at: now.toISOString(),
        method: 'gps',
        location: { lat: cachedPos?.lat, lng: cachedPos?.lng },
        is_late: isLate,
      })
      if (error) throw error
      toast({ message: 'เช็คอินสำเร็จ!', type: 'success' })
      loadToday()
    } catch {
      toast({ message: 'เช็คอินไม่สำเร็จ กรุณาลองใหม่', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckOut() {
    if (!todayRecord || todayRecord.check_out_at) return
    setLoading(true)
    try {
      const { error } = await supabase.from('attendance').update({ check_out_at: new Date().toISOString() }).eq('id', todayRecord.id)
      if (error) throw error
      toast({ message: 'เช็คเอาท์สำเร็จ', type: 'success' })
      loadToday()
    } catch {
      toast({ message: 'เกิดข้อผิดพลาด', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const checkedIn = !!todayRecord && !todayRecord.check_out_at
  const checkedOut = !!todayRecord?.check_out_at

  return (
    <div className="px-5 pt-12 page-enter">
      <h1 className="font-heading font-bold text-2xl mb-5">เช็คอิน</h1>

      {/* Map */}
      <div className="mb-4 rounded-3xl overflow-hidden border border-white/10" style={{ height: 220 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* GPS status */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 text-sm font-medium
                       ${gpsStatus === 'inside'   ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                       : gpsStatus === 'outside'  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                       : gpsStatus === 'locating' ? 'bg-white/5 border border-white/10 text-white/60'
                       : gpsStatus === 'error'    ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                       :                            'bg-white/5 border border-white/10 text-white/40'}`}>
        {gpsStatus === 'locating' ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
         : gpsStatus === 'inside'  ? <CheckCircle className="w-4 h-4 shrink-0" />
         : gpsStatus === 'outside' ? <XCircle className="w-4 h-4 shrink-0" />
         : gpsStatus === 'error'   ? <XCircle className="w-4 h-4 shrink-0" />
         :                           <MapPin className="w-4 h-4 shrink-0" />}
        <span>
          {gpsStatus === 'locating' ? 'กำลังระบุตำแหน่ง...'
           : gpsStatus === 'inside'  ? `อยู่ในรัศมีออฟฟิศ · ${distance}m`
           : gpsStatus === 'outside' ? `อยู่นอกรัศมีออฟฟิศ · ห่าง ${distance}m`
           : gpsStatus === 'error'   ? 'ไม่สามารถระบุตำแหน่งได้ — อนุญาต GPS แล้วรีเฟรช'
           :                           'รอตำแหน่ง GPS'}
        </span>
      </div>

      {/* Today record */}
      {todayRecord && (
        <div className="card mb-5 border border-green-500/20 bg-green-500/5">
          <p className="text-sm font-medium text-green-400 mb-1">สถานะวันนี้</p>
          <p className="text-white/60 text-sm">เข้างาน {formatTime(todayRecord.check_in_at)}
            {todayRecord.check_out_at ? ` · ออกงาน ${formatTime(todayRecord.check_out_at)}` : ''}
            {todayRecord.is_late ? ' · สาย' : ''}
          </p>
        </div>
      )}

      {/* Action button */}
      {!todayRecord && (
        <button onClick={handleCheckIn} disabled={loading || gpsStatus !== 'inside'}
                className="btn-primary w-full text-base py-4 disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><MapPin className="w-5 h-5" /> เช็คอิน</>}
        </button>
      )}
      {checkedIn && (
        <button onClick={handleCheckOut} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-orange-500/30 text-orange-400 font-semibold text-base hover:bg-orange-500/10 active:scale-[0.97] transition-all disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogOut className="w-5 h-5" /> เช็คเอาท์</>}
        </button>
      )}
      {checkedOut && (
        <div className="text-center py-4 text-white/40 text-sm">เสร็จสิ้นสำหรับวันนี้ ✓</div>
      )}
    </div>
  )
}
