const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_ITEM_NAME || 'TOKEN'

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}
