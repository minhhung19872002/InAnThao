const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.title || body.detail || JSON.stringify(body.errors || body)
    } catch {
      /* ignore body parse errors */
    }
    const err = new Error(detail || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  site: () => request('/site'),
  categories: () => request('/categories'),
  finishes: () => request('/finishes'),
  products: (category) => request(`/products${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  estimate: (params) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v)
    })
    return request(`/estimate?${qs.toString()}`)
  },
  createQuote: (payload) => request('/quotes', { method: 'POST', body: JSON.stringify(payload) }),
}

export const vnd = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(Number(n) || 0)) + '₫'
export const num = (n) => new Intl.NumberFormat('vi-VN').format(Number(n) || 0)
