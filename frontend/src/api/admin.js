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

async function parseError(res) {
  let detail = res.statusText
  try {
    const b = await res.json()
    if (b.errors) detail = Object.values(b.errors).flat().join(' · ')
    else detail = b.title || b.detail || (typeof b === 'string' ? b : JSON.stringify(b))
  } catch {
    try { detail = (await res.text()) || detail } catch { /* ignore */ }
  }
  const err = new Error(detail || `HTTP ${res.status}`)
  err.status = res.status
  return err
}

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData
  const res = await fetch(`${BASE}/api/admin${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      'X-Admin-Key': adminKey.get(),
      ...(options.headers || {}),
    },
  })
  if (res.status === 401) {
    const err = new Error('Sai mật khẩu hoặc phiên đã hết hạn')
    err.status = 401
    throw err
  }
  if (!res.ok) throw await parseError(res)
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
  // quotes
  stats: () => request('/stats'),
  quotes: ({ status = 'all', search = '', page = 1, pageSize = 20 } = {}) => {
    const qs = new URLSearchParams({ status, search, page, pageSize })
    return request(`/quotes?${qs}`)
  },
  setStatus: (id, status) => request(`/quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),
  // products
  categories: () => request('/categories'),
  products: () => request('/products'),
  createProduct: (dto) => request('/products', { method: 'POST', body: JSON.stringify(dto) }),
  updateProduct: (id, dto) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  toggleProduct: (id) => request(`/products/${id}/active`, { method: 'PATCH', body: JSON.stringify({ status: 'toggle' }) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  upload: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return request('/upload', { method: 'POST', body: fd })
  },
}

export const STATUS = [
  { value: 'new', label: 'Mới', color: '#1F9E63' },
  { value: 'contacted', label: 'Đã liên hệ', color: '#2F80ED' },
  { value: 'quoted', label: 'Đã báo giá', color: '#D6A84B' },
  { value: 'done', label: 'Hoàn tất', color: '#0F2D22' },
  { value: 'cancelled', label: 'Huỷ', color: '#C0392B' },
]
export const statusInfo = (v) => STATUS.find((s) => s.value === v) || { value: v, label: v, color: '#6B7F75' }
