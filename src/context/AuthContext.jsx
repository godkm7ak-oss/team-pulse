import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)      // employees row
  const [company, setCompany] = useState(null)      // companies row

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setCompany(null) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data: emp } = await supabase
      .from('employees')
      .select('*, companies(*)')
      .eq('user_id', userId)
      .single()

    if (emp) {
      setProfile(emp)
      setCompany(emp.companies)
    }
  }

  async function signUp({ fullName, companyName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, company_name: companyName } },
    })
    if (error) throw error
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signInEmployee({ companyCode, employeeCode }) {
    const { data: emp, error } = await supabase
      .from('employees')
      .select('*, companies!inner(*)')
      .eq('companies.join_code', companyCode.toUpperCase())
      .eq('employee_code', employeeCode.toUpperCase())
      .eq('status', 'active')
      .single()

    if (error || !emp) throw new Error('รหัสบริษัทหรือรหัสพนักงานไม่ถูกต้อง')

    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: emp.email,
      password: emp.employee_code.toLowerCase(),
    })
    if (signInErr) throw new Error('ไม่สามารถเข้าสู่ระบบได้ กรุณาติดต่อผู้ดูแล')
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner'
  const loading = session === undefined

  return (
    <AuthContext.Provider value={{
      session, profile, company, loading, isAdmin,
      signUp, signIn, signInEmployee, signOut, resetPassword, loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
