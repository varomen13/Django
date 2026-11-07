import { useAuth } from './useAuth.jsx'

export function useUser() {
  const { auth } = useAuth()
  return auth?.me ?? null
}
