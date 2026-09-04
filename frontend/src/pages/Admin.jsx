import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, adminKey } from '../api/admin'
import ProductsPanel from './admin/ProductsPanel'
import QuotesPanel from './admin/QuotesPanel'

function Login({ onDone }) {
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await adminApi.login(pw)
      onDone()
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <span className="eyebrow">Quản trị</span>
        <h1 className="h2" style={{ fontSize: 30 }}>Đăng nhập xưởng</h1>
        <label className="field">Mật khẩu quản trị
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus autoComplete="current-password" />
        </label>
        {err && <div className="qform__error">{err}</div>}
        <button type="submit" className="btn-pill qform__submit" disabled={busy || !pw}>{busy ? 'Đang kiểm tra…' : 'Đăng nhập'}</button>
        <Link to="/" className="link-btn" style={{ textAlign: 'center' }}>← Về trang chủ</Link>
      </form>
    </div>
  )
}

const TABS = [
  { key: 'quotes', label: 'Yêu cầu báo giá' },
  { key: 'products', label: 'Sản phẩm' },
]

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(adminKey.get()))
  const [tab, setTab] = useState(() => {
    try { return sessionStorage.getItem('inanthao.adminTab') || 'quotes' } catch { return 'quotes' }
  })

  const logout = useCallback(() => {
    adminKey.clear()
    setAuthed(false)
  }, [])

  const pickTab = (k) => {
    setTab(k)
    try { sessionStorage.setItem('inanthao.adminTab', k) } catch { /* ignore */ }
  }

  if (!authed) return <Login onDone={() => setAuthed(true)} />

  return (
    <div className="admin">
      <div className="admin__head">
        <div>
          <span className="eyebrow">Quản trị</span>
          <h1 className="h2" style={{ fontSize: 34 }}>{TABS.find((t) => t.key === tab)?.label}</h1>
        </div>
        <div className="admin__actions">
          <div className="cats">
            {TABS.map((t) => (
              <button type="button" key={t.key} className={`cats__btn${tab === t.key ? ' is-active' : ''}`} onClick={() => pickTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <button type="button" className="chip" onClick={logout}>Đăng xuất</button>
        </div>
      </div>

      {tab === 'quotes' ? <QuotesPanel onUnauthorized={logout} /> : <ProductsPanel onUnauthorized={logout} />}
    </div>
  )
}
