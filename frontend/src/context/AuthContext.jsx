import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getMeApi } from '../api/user.js'
import { getToken, removeToken, setToken } from '../api/token.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(undefined)

  useEffect(() => {
    let active = true
    const token = getToken()
    if (!token) {
      setAuth(null)
      return () => { active = false }
    }

    getMeApi(token)
      .then((me) => {
        if (active) setAuth({ token, me })
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) removeToken()
        else console.error('No se pudo restaurar la sesión.', error)
        if (active) setAuth(null)
      })

    return () => { active = false }
  }, [])

  const login = useCallback(async (token) => {
    const me = await getMeApi(token)
    setToken(token)
    setAuth({ token, me })
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setAuth(null)
  }, [])

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
