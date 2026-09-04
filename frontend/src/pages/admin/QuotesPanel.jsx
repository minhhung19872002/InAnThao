import { Fragment, useCallback, useEffect, useState } from 'react'
import { adminApi, STATUS, statusInfo } from '../../api/admin'
import { num, vnd } from '../../api/client'

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })

function StatCard({ label, value, tone }) {
  return (
    <div className="admin-stat" style={tone ? { borderColor: tone } : undefined}>
      <div className="admin-stat__l">{label}</div>
      <div className="admin-stat__n" style={tone ? { color: tone } : undefined}>{value}</div>
    </div>
  )
}

export default function QuotesPanel({ onUnauthorized }) {
  const [stats, setStats] = useState(null)
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 20 })
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, q] = await Promise.all([adminApi.stats(), adminApi.quotes({ status, search: query, page })])
      setStats(s)
      setData(q)
    } catch (e) {
      if (e.status === 401) onUnauthorized()
      else setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [status, query, page, onUnauthorized])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const changeStatus = async (id, value) => {
    try {
      const updated = await adminApi.setStatus(id, value)
      setData((d) => ({ ...d, items: d.items.map((x) => (x.id === id ? updated : x)) }))
      adminApi.stats().then(setStats).catch(() => {})
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = async (id) => {
    if (!window.confirm(`Xoá yêu cầu #${id}? Không thể hoàn tác.`)) return
    try {
      await adminApi.remove(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const pages = Math.max(1, Math.ceil(data.total / data.pageSize))

  return (
    <>
      {stats && (
        <div className="admin-stats">
          <StatCard label="Tổng yêu cầu" value={num(stats.total)} />
          <StatCard label="Hôm nay" value={num(stats.today)} />
          <StatCard label="Mới" value={num(stats.new)} tone="#00A651" />
          <StatCard label="Đã liên hệ" value={num(stats.contacted)} tone="#2F80ED" />
          <StatCard label="Đã báo giá" value={num(stats.quoted)} tone="#F7B746" />
          <StatCard label="Hoàn tất" value={num(stats.done)} tone="#3F4750" />
          <StatCard label="Ước tính (chưa huỷ)" value={vnd(stats.estimatedSum)} />
        </div>
      )}

      <div className="admin-toolbar">
        <div className="cats">
          {[{ value: 'all', label: 'Tất cả' }, ...STATUS].map((s) => (
            <button type="button" key={s.value} className={`cats__btn${status === s.value ? ' is-active' : ''}`} onClick={() => { setStatus(s.value); setPage(1) }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          <input className="admin-search" placeholder="Tìm tên, số điện thoại, sản phẩm, ghi chú…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="chip" onClick={load} disabled={loading}>{loading ? '…' : '↻'}</button>
        </div>
      </div>

      {error && <div className="qform__error" style={{ margin: '12px 0' }}>{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Thời gian</th><th>Khách hàng</th><th>Sản phẩm</th><th>SL</th><th>Ước tính</th><th>Trạng thái</th><th></th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && !loading && (
              <tr><td colSpan={8} className="empty">Chưa có yêu cầu nào.</td></tr>
            )}
            {data.items.map((q) => {
              const st = statusInfo(q.status)
              const isOpen = open === q.id
              return (
                <Fragment key={q.id}>
                  <tr className={isOpen ? 'is-open' : ''} onClick={() => setOpen(isOpen ? null : q.id)}>
                    <td className="mono">{q.id}</td>
                    <td className="nowrap">{fmtDate(q.createdAt)}</td>
                    <td>
                      <strong>{q.customerName}</strong>
                      <div><a href={`tel:${q.phone.replace(/\D/g, '')}`} onClick={(e) => e.stopPropagation()}>{q.phone}</a></div>
                    </td>
                    <td>
                      {q.productType}
                      {q.productSlug && <div className="admin-sub">{q.productSlug}</div>}
                    </td>
                    <td className="mono">{num(q.quantity)}</td>
                    <td className="mono nowrap">{q.estimatedTotal ? vnd(q.estimatedTotal) : '—'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select className="admin-status" style={{ borderColor: st.color, color: st.color }} value={q.status} onChange={(e) => changeStatus(q.id, e.target.value)}>
                        {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="link-btn danger" onClick={() => remove(q.id)}>Xoá</button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="admin-detail">
                      <td colSpan={8}>
                        <div className="admin-detail__grid">
                          <div><span>Chất liệu</span>{q.paper || '—'}</div>
                          <div><span>Gia công</span>{q.finish || '—'}</div>
                          <div><span>Ghi chú</span>{q.note || '—'}</div>
                          <div><span>Zalo</span><a href={`https://zalo.me/${q.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Mở Zalo {q.phone}</a></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-pager">
        <span>{num(data.total)} yêu cầu · trang {page}/{pages}</span>
        <div>
          <button type="button" className="chip" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Trước</button>
          <button type="button" className="chip" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Sau →</button>
        </div>
      </div>
    </>
  )
}
