const API_URL = (import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const body = await response.text()
  let data = null
  if (body) {
    try {
      data = JSON.parse(body)
    } catch {
      data = body
    }
  }

  if (!response.ok) {
    const error = new Error(formatApiError(data) || `Error HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return data
}

function formatApiError(data) {
  if (typeof data === 'string') return data
  if (data?.detail) return data.detail
  if (data && typeof data === 'object') {
    return Object.entries(data)
      .map(([field, messages]) => {
        const values = Array.isArray(messages) ? messages : [messages]
        return `${field}: ${values.map(String).join(', ')}`
      })
      .join(' ')
  }
  return ''
}

export function loginApi(email, password) {
  return request('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getMeApi(token) {
  return request('/auth/me/', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function registerApi(values) {
  return request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}
