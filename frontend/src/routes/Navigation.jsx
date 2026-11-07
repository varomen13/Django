import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Button, Icon, Loader } from 'semantic-ui-react'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '../hooks/useAuth.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Login from '../pages/Login.jsx'
import NotFound from '../pages/NotFound.jsx'
import Register from '../pages/Register.jsx'

function CommonLayout() {
  const { auth } = useAuth()
  if (auth === undefined) return <div className="loader-wrap"><Loader active inline="centered">Cargando...</Loader></div>
  if (auth) return <Navigate to="/dashboard" replace />
  return <main><Outlet /></main>
}

function AdminLayout() {
  const { auth, logout } = useAuth()
  if (auth === undefined) return <div className="loader-wrap"><Loader active inline="centered">Cargando...</Loader></div>
  if (!auth) return <Navigate to="/login" replace />

  const name = [auth.me.first_name, auth.me.last_name].filter(Boolean).join(' ') || auth.me.username
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return (
    <>
      <header className="topbar">
        <div className="store-brand">
          <span className="store-logo-icon"><Icon name="shopping cart" /></span>
          <span>Tienda Online</span>
        </div>
        <div className="topbar-account">
          <span className="account-avatar" aria-label={`Avatar de ${name}`}>{initials}</span>
          <span className="account-name">{name}</span>
          <Button basic inverted onClick={logout}>Cerrar sesión</Button>
        </div>
      </header>
      <Outlet />
    </>
  )
}

export default function Navigation() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<CommonLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3500} />
    </>
  )
}
