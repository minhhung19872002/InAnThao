import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, num, vnd } from '../api/client'
import { useSite } from '../siteContext'

const DISCOUNT_QTY = 500
const DISCOUNT = 0.15

const initialForm = (categories, prefill) => ({
  product: prefill?.product || categories[0]?.name || 'Thiệp cưới',
  productSlug: prefill?.productSlug || '',
  paper: prefill?.paper || '',
  finish: prefill?.finish || '',
  unitPrice: prefill?.unitPrice ?? null,
  name: '',
  phone: '',
  qty: prefill?.qty || 300,
  note: '',
})

/** Quick-quote section: dark "chrome" panel with perks + cream form card (design section #bao-gia). */
export default function QuoteForm() {
  const { site, categories } = useSite()
  const location = useLocation()
  const prefill = location.state?.quote
  const [form, setForm] = useState(() => initialForm(categories, prefill))
  const [sent, setSent] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  // Re-apply prefill when arriving from a product page ("Yêu cầu báo giá chính xác").
  useEffect(() => {
    if (prefill) {
      setForm((f) => ({ ...f, ...initialForm(categories, prefill), name: f.name, phone: f.phone, note: f.note }))
      setSent(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => (k === 'product' ? { ...f, product: v, productSlug: '', paper: '', finish: '', unitPrice: null } : { ...f, [k]: v }))
  }

  const qty = Number(form.qty) || 0
  const estimate = useMemo(() => {
    const cat = categories.find((c) => c.name === form.product)
    const unit = form.unitPrice ?? cat?.basePrice ?? 4500
    return qty ? qty * unit * (qty >= DISCOUNT_QTY ? 1 - DISCOUNT : 1) : 0
  }, [categories, form.product, form.unitPrice, qty])

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!/^\d{9,11}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Số điện thoại không hợp lệ'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setError(null)
    try {
      const res = await api.createQuote({
        productType: categories.find((c) => c.name === form.product)?.slug || form.product,
        productSlug: form.productSlug || null,
        paper: form.paper || null,
        finish: form.finish || null,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        quantity: qty,
        note: form.note.trim() || null,
      })
      setSent({ ...res, phone: form.phone })
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu thất bại, vui lòng gọi hotline.')
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setSent(null)
    setForm(initialForm(categories))
    setFieldErrors({})
  }

  return (
    <section id="bao-gia" className="section--quote">
      <div className="quote">
        <div className="quote__glow1" />
        <div className="quote__glow2" />
        <div>
          <span className="quote__eyebrow">Báo giá nhanh</span>
          <h2 className="quote__h2">Gửi yêu cầu, nhận giá trong 15 phút</h2>
          <p className="quote__p">Điền vài thông tin cơ bản. Nhân viên xưởng sẽ gọi lại tư vấn chất liệu, số lượng và thời gian in phù hợp.</p>
          <div className="perks">
            {site.perks.map((k) => (
              <div className="perk" key={k}><span className="check-dot">✓</span>{k}</div>
            ))}
          </div>
        </div>

        <div className="qform">
          {sent ? (
            <div className="qform__done">
              <span className="check-dot">✓</span>
              <strong>Đã nhận yêu cầu!</strong>
              <p>Chúng tôi sẽ liên hệ số {sent.phone} trong ít phút nữa.</p>
              {sent.id && <p style={{ fontSize: 13, color: '#8C8A7E' }}>Mã yêu cầu #{sent.id} · Ước tính {vnd(sent.estimatedTotal)}</p>}
              <button type="button" className="btn-outline" onClick={reset}>Gửi yêu cầu khác</button>
            </div>
          ) : (
            <form className="qform__grid" onSubmit={submit} noValidate>
              <label className="field">Sản phẩm cần in
                <select value={form.product} onChange={set('product')}>
                  {categories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>
              </label>
              {form.productSlug && (
                <div className="qform__est" style={{ padding: '10px 14px' }}>
                  <span>Mẫu đã chọn: <strong style={{ fontFamily: 'inherit', fontSize: 13, color: '#1F7F5C' }}>{prefill?.productName}</strong>
                    {form.paper ? ` · ${form.paper}` : ''}{form.finish ? ` · ${form.finish}` : ''}</span>
                </div>
              )}
              <div className="qform__row2">
                <label className="field">Họ tên
                  <input value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" autoComplete="name" />
                  {fieldErrors.name && <span className="err">{fieldErrors.name}</span>}
                </label>
                <label className="field">Số điện thoại
                  <input value={form.phone} onChange={set('phone')} placeholder="09xx xxx xxx" inputMode="tel" autoComplete="tel" />
                  {fieldErrors.phone && <span className="err">{fieldErrors.phone}</span>}
                </label>
              </div>
              <label className="field">
                <span>Số lượng: <strong style={{ color: '#00A651' }}>{num(qty)} sản phẩm</strong></span>
                <input type="range" min="50" max="2000" step="50" value={form.qty} onChange={set('qty')} />
              </label>
              <label className="field">Ghi chú
                <textarea value={form.note} onChange={set('note')} rows={3} placeholder="Chất liệu, ngày cần nhận…" />
              </label>
              <div className="qform__est">
                <span>Ước tính tạm thời</span>
                <strong>{qty ? vnd(estimate) : '—'}</strong>
              </div>
              {error && <div className="qform__error">{error}</div>}
              <button type="submit" className="btn-pill qform__submit" disabled={busy}>
                {busy ? 'Đang gửi…' : 'Gửi yêu cầu báo giá'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
