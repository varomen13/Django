const API_URL = (import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export async function getCountryApi(token) {
  const response = await fetch(`${API_URL}/api/v1/soap/country/MX/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || `No se pudo consultar el país (HTTP ${response.status}).`)
  }
  return data
}
