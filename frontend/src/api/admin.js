const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const KEY_STORAGE = 'inanthao.adminKey'

export const adminKey = {
  get: () => {
    try { return sessionStorage.getItem(KEY_STORAGE) || '' } catch { return '' }
  },
  set: (v) => {
    try { sessionStorage.setItem(KEY_STORAGE, v) } catch { /* ignore */ }
  },
  clear: () => {
    try { sessionStorage.removeItem(KEY_STORAGE) } catch { /* ignore */ }
  },
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api/admin${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey.get(), ...(options.headers || {}) },
  })
  if (res.status === 401) {
    const err = new Error('Sai mật khẩu hoặc phiên đã hết hạn')
    err.status = 401
    throw err
  }
  if (!res.ok) {
    let detail = res.statusText
    try { const b = await res.json(); detail = b.title || b.detail || JSON.stringify(b) } catch { /* ignore */ }
    const err = new Error(detail || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const adminApi = {
  login: async (password) => {
    adminKey.set(password)
    try {
      await request('/me')
      return true
    } catch (e) {
      adminKey.clear()
      throw e
    }
  },
  stats: () => request('/stats'),
  quotes: ({ status = 'all', search = '', page = 1, pageSize = 20 } = {}) => {
    const qs = new URLSearchParams({ status, search, page, pageSize })
    return request(`/quotes?${qs}`)
  },
  setStatus: (id, status) => request(`/quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),
}

export const STATUS = [
  { value: 'new', label: 'Mới', color: '#00A651' },
  { value: 'contacted', label: 'Đã liên hệ', color: '#2F80ED' },
  { value: 'quoted', label: 'Đã báo giá', color: '#F7B746' },
  { value: 'done', label: 'Hoàn tất', color: '#3F4750' },
  { value: 'cancelled', label: 'Huỷ', color: '#C0392B' },
]
export const statusInfo = (v) => STATUS.find((s) => s.value === v) || { value: v, label: v, color: '#8C8A7E' }
