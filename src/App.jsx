import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { exchangeCode, hasToken, logout } from './lib/auth'
import { getMe } from './lib/spotify'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Personality from './pages/Personality'
import DeepDive from './pages/DeepDive'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    async function init() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        window.history.replaceState({}, '', window.location.pathname)
        const ok = await exchangeCode(code)
        if (!ok) { if (active) setChecking(false); return }
      }

      if (hasToken()) {
        const profile = await getMe()
        if (active && profile) {
          setUser(profile)
          setAuthed(true)
        } else if (active && !profile) {
          logout()
        }
      }

      if (active) setChecking(false)
    }

    init()
    return () => { active = false }
  }, [])

  if (checking) return <div className="app-loading" />
  if (!authed) return <Login />

  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/personality" element={<Personality />} />
            <Route path="/deep-dive" element={<DeepDive />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
