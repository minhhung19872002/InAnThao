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

/** Section #bao-gia ported from the v2 design; submits to POST /api/quotes. */
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

  const inputS = 'padding:13px 14px;border:1.5px solid #E3DCCB;border-radius:12px;background:#FBF8F2'
  const labelS = 'display:grid;gap:6px;font-size:12.5px;font-weight:600;color:#4E5F57;letter-spacing:.02em'

  return (
    <H as="section" id="bao-gia" data-reveal="" s="max-width:1280px;margin:110px auto 0;padding:0 28px">
      <H data-r="two quote" s="position:relative;overflow:hidden;background:#E7F5EA;color:#0F2D22;border-radius:34px;padding:64px;border:1px solid rgba(15,45,34,.08);display:grid;grid-template-columns:1fr 1fr;gap:64px">
        <H s="position:absolute;top:-200px;left:-140px;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(61,220,132,.3),transparent 65%);pointer-events:none" />
        <H s="position:absolute;bottom:-240px;right:20%;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(214,168,75,.2),transparent 65%);pointer-events:none" />
        <H s="position:relative">
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#1F7F5C;font-weight:600"><H as="span" s="width:28px;height:2px;background:#3DDC84" />Báo giá nhanh</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:50px;margin:14px 0 16px;letter-spacing:-.03em;font-weight:500;line-height:1.02">Gửi yêu cầu,<br />nhận giá trong 15 phút</H>
          <H as="p" s="font-size:16px;line-height:1.7;color:#4E5F57;margin:0 0 30px;max-width:40ch;font-weight:300">Điền vài thông tin cơ bản. Nhân viên xưởng sẽ gọi lại tư vấn chất liệu, số lượng và thời gian in phù hợp.</H>
          <H s="display:grid;gap:14px">
            {site.perks.map((k) => (
              <H key={k} s="display:flex;gap:14px;align-items:center;font-size:15px;color:#0F2D22"><H as="span" s="width:26px;height:26px;border-radius:50%;background:#1F9E63;color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700">✓</H>{k}</H>
            ))}
          </H>
        </H>

        <H s="position:relative;background:#fff;color:#0F2D22;border-radius:24px;padding:30px;box-shadow:0 50px 90px -50px rgba(15,45,34,.45)">
          {sent ? (
            <H s="display:grid;gap:12px;place-items:center;text-align:center;padding:56px 8px">
              <H as="span" s="width:56px;height:56px;border-radius:50%;background:#3DDC84;color:#0F2D22;display:grid;place-items:center;font-size:24px;font-weight:700">✓</H>
              <H as="strong" s="font-family:'Playfair Display',serif;font-size:28px">Đã nhận yêu cầu!</H>
              <H as="p" s="margin:0;color:#4E5F57;font-size:15px">Chúng tôi sẽ liên hệ số {form.phone} trong ít phút nữa.</H>
              <H as="button" type="button" onClick={reset} s="margin-top:6px;border:1.5px solid #0F2D22;background:none;padding:11px 20px;border-radius:999px;font-weight:600;cursor:pointer">Gửi yêu cầu khác</H>
            </H>
          ) : (
            <H s="display:grid;gap:14px">
              <H as="label" s={labelS}>Sản phẩm cần in
                <H as="select" value={form.product} onChange={set('product')} s={`${inputS};font-weight:500`}>
                  {categories.map((o) => <option key={o.slug} value={o.name}>{o.name}</option>)}
                </H>
              </H>
              {form.productSlug && (
                <H s="font-size:13px;color:#4E5F57;padding:10px 14px;background:#E7F5EA;border-radius:12px">Mẫu đã chọn: <strong style={{ color: '#1F7F5C' }}>{form.productName}</strong>{form.paper ? ` · ${form.paper}` : ''}{form.finish ? ` · ${form.finish}` : ''}</H>
              )}
              <H data-r="form2" s="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                <H as="label" s={labelS}>Họ tên
                  <H as="input" value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" s={inputS} />
                </H>
                <H as="label" s={labelS}>Số điện thoại
                  <H as="input" value={form.phone} onChange={set('phone')} placeholder="09xx xxx xxx" inputMode="tel" s={inputS} />
                </H>
              </H>
              <H as="label" s="display:grid;gap:8px;font-size:12.5px;font-weight:600;color:#4E5F57;letter-spacing:.02em"><span>Số lượng · <H as="strong" s="color:#1F7F5C">{num(qty)} sản phẩm</H></span>
                <H as="input" type="range" min="50" max="2000" step="50" value={form.qty} onChange={set('qty')} s="accent-color:#00A651" />
              </H>
              <H as="label" s={labelS}>Ghi chú
                <H as="textarea" value={form.note} onChange={set('note')} rows={3} placeholder="Chất liệu, ngày cần nhận…" s={`${inputS};resize:vertical`} />
              </H>
              <H s="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;background:#fff;border:1.5px dashed #D6A84B;border-radius:14px">
                <H as="span" s="font-size:13px;color:#4E5F57">Ước tính tạm thời</H>
                <H as="strong" s="font-family:'Playfair Display',serif;font-size:24px;color:#0F2D22">{qty ? vnd(total) : '—'}</H>
              </H>
              {error && <H s="font-size:13px;color:#C0392B">{error}</H>}
              <H as="button" type="button" onClick={submit} disabled={busy} s={`border:0;cursor:pointer;padding:16px;border-radius:999px;background:#1F9E63;color:#fff;font-weight:700;font-size:15px;transition:all .2s ease;box-shadow:0 14px 28px -14px rgba(31,158,99,.7)${busy ? ';opacity:.6' : ''}`} h="background:#0F2D22;color:#fff">{busy ? 'Đang gửi…' : 'Gửi yêu cầu báo giá'}</H>
            </H>
          )}
        </H>
      </H>
    </H>
  )
}
