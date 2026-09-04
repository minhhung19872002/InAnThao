import { useCallback, useEffect, useRef, useState } from 'react'
import { adminApi } from '../../api/admin'
import { num } from '../../api/client'

const EMPTY = { name: '', slug: '', categoryId: 0, priceLabel: '', basePrice: '', imageUrl: '', description: '', sortOrder: 0, isActive: true }

function ProductForm({ initial, categories, onSaved, onCancel, onUnauthorized }) {
  const [f, setF] = useState(() => ({ ...EMPTY, categoryId: categories[0]?.id || 0, ...(initial || {}), basePrice: initial?.basePrice ?? '' }))
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)
  const isEdit = Boolean(initial?.id)

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setF((s) => ({ ...s, [k]: v }))
  }

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const r = await adminApi.upload(file)
      setF((s) => ({ ...s, imageUrl: r.url }))
    } catch (e) {
      if (e.status === 401) onUnauthorized()
      else setError(e.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const dto = {
        name: f.name,
        slug: f.slug || null,
        categoryId: Number(f.categoryId),
        priceLabel: f.priceLabel,
        basePrice: f.basePrice === '' ? null : Number(f.basePrice),
        imageUrl: f.imageUrl,
        description: f.description,
        sortOrder: Number(f.sortOrder) || 0,
        isActive: Boolean(f.isActive),
      }
      const saved = isEdit ? await adminApi.updateProduct(initial.id, dto) : await adminApi.createProduct(dto)
      onSaved(saved)
    } catch (ex) {
      if (ex.status === 401) onUnauthorized()
      else setError(ex.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form__head">
        <strong>{isEdit ? `Sửa sản phẩm #${initial.id}` : 'Thêm sản phẩm mới'}</strong>
        <button type="button" className="link-btn" onClick={onCancel}>Đóng</button>
      </div>

      <div className="admin-form__grid">
        <div className="admin-form__media">
          <div className="admin-form__preview">
            {f.imageUrl ? <img src={f.imageUrl} alt="" /> : <span>Chưa có ảnh</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
          <button type="button" className="chip" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang tải ảnh…' : '⬆ Tải ảnh lên'}
          </button>
          <label className="field">Hoặc dán link ảnh
            <input value={f.imageUrl} onChange={set('imageUrl')} placeholder="https://… hoặc /uploads/…" />
          </label>
        </div>

        <div className="admin-form__fields">
          <label className="field">Tên sản phẩm *
            <input value={f.name} onChange={set('name')} placeholder="Thiệp cưới Hot Trend" required />
          </label>
          <div className="admin-form__row">
            <label className="field">Danh mục *
              <select value={f.categoryId} onChange={set('categoryId')}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="field">Giá hiển thị *
              <input value={f.priceLabel} onChange={set('priceLabel')} placeholder="từ 4.500₫" required />
            </label>
          </div>
          <div className="admin-form__row">
            <label className="field">Đơn giá tính toán (₫)
              <input type="number" min="0" step="1" value={f.basePrice} onChange={set('basePrice')} placeholder="Bỏ trống = lấy số trong giá hiển thị" />
            </label>
            <label className="field">Thứ tự hiển thị
              <input type="number" value={f.sortOrder} onChange={set('sortOrder')} />
            </label>
          </div>
          <label className="field">Mô tả
            <textarea rows={4} value={f.description} onChange={set('description')} placeholder="Chất liệu, kiểu in, điểm nổi bật…" />
          </label>
          <div className="admin-form__row">
            <label className="field">Đường dẫn (slug)
              <input value={f.slug} onChange={set('slug')} placeholder={isEdit ? initial.slug : 'tự tạo từ tên'} />
            </label>
            <label className="field admin-check">
              <span>Hiển thị trên website</span>
              <input type="checkbox" checked={Boolean(f.isActive)} onChange={set('isActive')} />
            </label>
          </div>
        </div>
      </div>

      {error && <div className="qform__error">{error}</div>}
      <div className="admin-form__actions">
        <button type="submit" className="btn-pill" style={{ padding: '12px 24px' }} disabled={busy || uploading}>
          {busy ? 'Đang lưu…' : isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </button>
        <button type="button" className="chip" onClick={onCancel}>Huỷ</button>
      </div>
    </form>
  )
}

export default function ProductsPanel({ onUnauthorized }) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [filterCat, setFilterCat] = useState(0)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, p] = await Promise.all([adminApi.categories(), adminApi.products()])
      setCategories(c)
      setItems(p)
    } catch (e) {
      if (e.status === 401) onUnauthorized()
      else setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => { load() }, [load])

  const onSaved = (saved) => {
    setItems((list) => {
      const idx = list.findIndex((x) => x.id === saved.id)
      const next = idx >= 0 ? list.map((x) => (x.id === saved.id ? saved : x)) : [...list, saved]
      return next.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    })
    setEditing(null)
  }

  const toggle = async (p) => {
    try {
      const updated = await adminApi.toggleProduct(p.id)
      setItems((list) => list.map((x) => (x.id === p.id ? updated : x)))
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Xoá "${p.name}"? Không thể hoàn tác. (Có thể chỉ cần tắt "Hiển thị".)`)) return
    try {
      await adminApi.deleteProduct(p.id)
      setItems((list) => list.filter((x) => x.id !== p.id))
    } catch (e) {
      alert(e.message)
    }
  }

  const q = search.trim().toLowerCase()
  const visible = items.filter((p) => (!filterCat || p.categoryId === filterCat) && (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q)))

  return (
    <>
      <div className="admin-toolbar">
        <div className="cats">
          <button type="button" className={`cats__btn${filterCat === 0 ? ' is-active' : ''}`} onClick={() => setFilterCat(0)}>Tất cả ({items.length})</button>
          {categories.map((c) => (
            <button type="button" key={c.id} className={`cats__btn${filterCat === c.id ? ' is-active' : ''}`} onClick={() => setFilterCat(c.id)}>
              {c.name} ({items.filter((p) => p.categoryId === c.id).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <input className="admin-search" placeholder="Tìm theo tên…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="btn-pill" style={{ padding: '11px 20px' }} onClick={() => setEditing('new')} disabled={!categories.length}>+ Thêm sản phẩm</button>
        </div>
      </div>

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? null : editing}
          categories={categories}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
          onUnauthorized={onUnauthorized}
        />
      )}

      {error && <div className="qform__error" style={{ margin: '12px 0' }}>{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table admin-table--products">
          <thead>
            <tr><th>Ảnh</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Thứ tự</th><th>Hiển thị</th><th></th></tr>
          </thead>
          <tbody>
            {visible.length === 0 && !loading && <tr><td colSpan={7} className="empty">Chưa có sản phẩm.</td></tr>}
            {visible.map((p) => (
              <tr key={p.id} className={p.isActive ? '' : 'is-off'} onClick={() => setEditing(p)}>
                <td><div className="admin-thumb">{p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : null}</div></td>
                <td>
                  <strong>{p.name}</strong>
                  <div className="admin-sub">/san-pham/{p.slug}</div>
                </td>
                <td>{p.category}</td>
                <td>
                  {p.priceLabel}
                  <div className="admin-sub">đơn giá {num(p.basePrice)}₫</div>
                </td>
                <td className="mono">{p.sortOrder}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button type="button" className={`admin-toggle${p.isActive ? ' is-on' : ''}`} onClick={() => toggle(p)} title={p.isActive ? 'Đang hiển thị' : 'Đang ẩn'}>
                    <span />
                  </button>
                </td>
                <td onClick={(e) => e.stopPropagation()} className="nowrap">
                  <button type="button" className="link-btn" onClick={() => setEditing(p)}>Sửa</button>
                  <span style={{ color: '#DDD5C4', margin: '0 8px' }}>|</span>
                  <button type="button" className="link-btn danger" onClick={() => remove(p)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
