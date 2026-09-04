import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, num, vnd } from '../api/client'
import { useSite } from '../siteContext'
import H from '../ui/H'

const initialForm = (categories, prefill) => ({
  product: prefill?.product || categories[0]?.name || 'Thiệp cưới',
  productSlug: prefill?.productSlug || '',
  productName: prefill?.productName || '',
  paper: prefill?.paper || '',
  finish: prefill?.finish || '',
  unitPrice: prefill?.unitPrice ?? null,
  name: '',
  phone: '',
  qty: prefill?.qty || 300,
  note: '',
})

/** Section #bao-gia ported from the design; submits to POST /api/quotes. */
export default function QuoteForm() {
  const { site, categories } = useSite()
  const location = useLocation()
  const prefill = location.state?.quote
  const [form, setForm] = useState(() => initialForm(categories, prefill))
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (prefill) {
      setForm((f) => ({ ...f, ...initialForm(categories, prefill), name: f.name, phone: f.phone, note: f.note }))
      setSent(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => (k === 'product' ? { ...f, product: v, productSlug: '', productName: '', paper: '', finish: '', unitPrice: null } : { ...f, [k]: v }))
  }

  const qty = Number(form.qty) || 0
  const unit = form.unitPrice ?? categories.find((c) => c.name === form.product)?.basePrice ?? 4500
  const total = useMemo(() => qty * unit * (qty >= 500 ? 0.85 : 1), [qty, unit])

  const submit = async () => {
    setError(null)
    if (!form.name.trim()) return setError('Vui lòng nhập họ tên.')
    if (!/^\d{9,11}$/.test(form.phone.replace(/\D/g, ''))) return setError('Số điện thoại không hợp lệ.')
    setBusy(true)
    try {
      await api.createQuote({
        productType: categories.find((c) => c.name === form.product)?.slug || form.product,
        productSlug: form.productSlug || null,
        paper: form.paper || null,
        finish: form.finish || null,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        quantity: qty,
        note: form.note.trim() || null,
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu thất bại, vui lòng gọi hotline.')
    } finally {
      setBusy(false)
    }
  }
  const reset = () => { setSent(false); setForm(initialForm(categories)); setError(null) }

  const inputS = 'padding:12px 14px;border:1px solid #D7DDD6;border-radius:11px;background:#fff'
  const labelS = 'display:grid;gap:6px;font-size:13px;font-weight:500;color:#4A5158'

  return (
    <H as="section" id="bao-gia" s="max-width:1240px;margin:84px auto 0;padding:0 24px">
      <H data-r="quote" s="position:relative;overflow:hidden;background:linear-gradient(135deg,#5A626B 0%,#3F4750 45%,#2E353C 100%);color:#FCFAED;border-radius:30px;padding:58px;display:grid;grid-template-columns:1fr 1fr;gap:56px">
        <H s="position:absolute;top:-160px;left:-120px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(0,166,81,.28),transparent 65%);pointer-events:none" />
        <H s="position:absolute;bottom:-200px;right:30%;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(247,183,70,.14),transparent 65%);pointer-events:none" />
        <div>
          <H as="span" s="font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#F7B746">Báo giá nhanh</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:40px;margin:12px 0 14px;letter-spacing:-.015em">Gửi yêu cầu, nhận giá trong 15 phút</H>
          <H as="p" s="font-size:16px;line-height:1.65;color:#A9B4AE;margin:0 0 26px;max-width:42ch">Điền vài thông tin cơ bản. Nhân viên xưởng sẽ gọi lại tư vấn chất liệu, số lượng và thời gian in phù hợp.</H>
          <H s="display:grid;gap:14px">
            {site.perks.map((k) => (
              <H key={k} s="display:flex;gap:12px;align-items:center;font-size:15px;color:#E8E4D6"><H as="span" s="width:22px;height:22px;border-radius:50%;background:#00A651;color:#fff;display:grid;place-items:center;font-size:12px">✓</H>{k}</H>
            ))}
          </H>
        </div>

        <H s="position:relative;background:#FCFAED;color:#3F4750;border-radius:22px;padding:30px;box-shadow:0 40px 80px -40px rgba(0,0,0,.6)">
          {sent ? (
            <H s="display:grid;gap:12px;place-items:center;text-align:center;padding:52px 8px">
              <H as="span" s="width:52px;height:52px;border-radius:50%;background:#00A651;color:#fff;display:grid;place-items:center;font-size:22px">✓</H>
              <H as="strong" s="font-family:'Playfair Display',serif;font-size:26px">Đã nhận yêu cầu!</H>
              <H as="p" s="margin:0;color:#4A5158;font-size:15px">Chúng tôi sẽ liên hệ số {form.phone} trong ít phút nữa.</H>
              <H as="button" type="button" onClick={reset} s="margin-top:6px;border:1px solid #3F4750;background:none;padding:11px 20px;border-radius:999px;font-weight:600;cursor:pointer">Gửi yêu cầu khác</H>
            </H>
          ) : (
            <H s="display:grid;gap:14px">
              <H as="label" s={labelS}>Sản phẩm cần in
                <H as="select" value={form.product} onChange={set('product')} s={inputS}>
                  {categories.map((o) => <option key={o.slug} value={o.name}>{o.name}</option>)}
                </H>
              </H>
              {form.productSlug && (
                <H s="font-size:13px;color:#4A5158;padding:10px 14px;background:#F2FAF6;border-radius:12px">Mẫu đã chọn: <strong style={{ color: '#1F7F5C' }}>{form.productName}</strong>{form.paper ? ` · ${form.paper}` : ''}{form.finish ? ` · ${form.finish}` : ''}</H>
              )}
              <H s="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                <H as="label" s={labelS}>Họ tên
                  <H as="input" value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" s={inputS} />
                </H>
                <H as="label" s={labelS}>Số điện thoại
                  <H as="input" value={form.phone} onChange={set('phone')} placeholder="09xx xxx xxx" inputMode="tel" s={inputS} />
                </H>
              </H>
              <H as="label" s="display:grid;gap:8px;font-size:13px;font-weight:500;color:#4A5158"><span>Số lượng: <H as="strong" s="color:#00A651">{num(qty)} sản phẩm</H></span>
                <H as="input" type="range" min="50" max="2000" step="50" value={form.qty} onChange={set('qty')} s="accent-color:#00A651" />
              </H>
              <H as="label" s={labelS}>Ghi chú
                <H as="textarea" value={form.note} onChange={set('note')} rows={3} placeholder="Chất liệu, ngày cần nhận…" s={`${inputS};resize:vertical`} />
              </H>
              <H s="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;background:#F2FAF6;border-radius:12px">
                <H as="span" s="font-size:13px;color:#4A5158">Ước tính tạm thời</H>
                <H as="strong" s="font-family:'Playfair Display',serif;font-size:22px;color:#00A651">{qty ? vnd(total) : '—'}</H>
              </H>
              {error && <H s="font-size:13px;color:#C0392B">{error}</H>}
              <H as="button" type="button" onClick={submit} disabled={busy} s={`border:0;cursor:pointer;padding:15px;border-radius:999px;background:#00A651;color:#fff;font-weight:600;font-size:15px${busy ? ';opacity:.6' : ''}`} h="background:#1F7F5C">{busy ? 'Đang gửi…' : 'Gửi yêu cầu báo giá'}</H>
            </H>
          )}
        </H>
      </H>
    </H>
  )
}
