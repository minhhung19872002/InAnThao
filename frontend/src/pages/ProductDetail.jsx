import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, num, vnd } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'
import H from '../ui/H'

/** The `detail` branch of the v2 design (breadcrumb, gallery, options, pricing box, specs, related). */
export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { site } = useSite()
  const { data, loading, error } = useApi(() => api.product(slug), [slug])

  const [mainImg, setMainImg] = useState(null)
  const [paper, setPaper] = useState(0)
  const [finish, setFinish] = useState(0)
  const [dQty, setDQty] = useState(300)

  useEffect(() => {
    setMainImg(null); setPaper(0); setFinish(0); setDQty(300)
    window.scrollTo({ top: 0 })
  }, [slug])

  const box = data?.product
  const papers = data?.paperOptions || []
  const finishes = data?.finishes || []
  const srcs = data?.gallery || []
  const active = mainImg || srcs[0]

  const { unitFinal, dTotal } = useMemo(() => {
    const base = box?.basePrice || 0
    const pm = papers[paper]?.multiplier ?? 1
    const fm = finishes[finish]?.multiplier ?? 1
    const u = base * pm * fm
    return { unitFinal: u, dTotal: u * dQty * (dQty >= 500 ? 0.85 : 1) }
  }, [box, papers, finishes, paper, finish, dQty])

  const qtyUp = () => setDQty((q) => Math.min(5000, q + (q >= 500 ? 100 : 50)))
  const qtyDown = () => setDQty((q) => Math.max(50, q - (q > 500 ? 100 : 50)))
  const goHome = () => { navigate('/'); window.scrollTo({ top: 0 }) }
  const goCat = () => navigate(`/?cat=${box.categorySlug}`, { state: { scrollTo: 'danh-muc' } })
  const orderNow = () => navigate('/', {
    state: {
      scrollTo: 'bao-gia',
      quote: { product: box.category, productSlug: box.slug, productName: box.name, paper: papers[paper]?.label, finish: finishes[finish]?.label, unitPrice: Math.round(unitFinal), qty: dQty },
    },
  })

  if (loading) return <H s="max-width:1280px;margin:0 auto;padding:60px 28px;color:#6B7F75">Đang tải sản phẩm…</H>
  if (error || !box) {
    return (
      <H s="max-width:720px;margin:80px auto;padding:0 28px;text-align:center">
        <H as="h1" data-r="h2" s="font-family:'Playfair Display',serif;font-size:50px;margin:0 0 12px;letter-spacing:-.03em;font-weight:500;line-height:1.02">Không tìm thấy sản phẩm</H>
        <H as="p" s="color:#4E5F57;margin:0 0 24px;font-weight:300">Mẫu này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</H>
        <H as="button" type="button" onClick={goHome} s="border:0;cursor:pointer;padding:15px 26px;border-radius:999px;background:#1F9E63;color:#fff;font-weight:700;font-size:15px;transition:all .2s ease" h="background:#0F2D22">Về trang chủ</H>
      </H>
    )
  }

  const specs = [
    ...(data.specs || []),
    { key: 'Chất liệu đã chọn', value: papers[paper]?.label || '—' },
    { key: 'Gia công đã chọn', value: finishes[finish]?.label || '—' },
  ]
  const tel = site.phone.replace(/\s/g, '')
  const optS = (on) => `cursor:pointer;padding:12px 18px;border-radius:999px;border:1.5px solid ${on ? '#0F2D22' : '#DDD5C4'};background:${on ? '#0F2D22' : '#fff'};color:${on ? '#F4EFE4' : '#0F2D22'};font-size:14px;font-weight:600;transition:all .18s ease`

  return (
    <H s="animation:rise .3s ease both">
      <H s="max-width:1280px;margin:0 auto;padding:26px 28px 0;display:flex;align-items:center;gap:10px;font-size:13.5px;color:#6B7F75">
        <H as="button" type="button" onClick={goHome} s="background:none;border:0;padding:0;cursor:pointer;color:#1F7F5C;font-weight:600">Trang chủ</H><span>/</span>
        <H as="button" type="button" onClick={goCat} s="background:none;border:0;padding:0;cursor:pointer;color:#1F7F5C;font-weight:600">{box.category}</H><span>/</span>
        <H as="span" s="color:#0F2D22">{box.name}</H>
      </H>

      <H as="section" data-r="two" s="max-width:1280px;margin:0 auto;padding:26px 28px 0;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start">
        <H data-r="sticky" s="display:grid;gap:14px;position:sticky;top:104px">
          <H data-r="media" s="position:relative;border-radius:28px;overflow:hidden;background:#E9E2D3;aspect-ratio:4/5;box-shadow:0 50px 90px -46px rgba(15,45,34,.55)">
            <img data-slot={`detail-main-${box.slug}`} src={active} alt={box.name} />
          </H>
          <H data-r="thumbs" s="display:flex;gap:12px">
            {srcs.map((s, i) => (
              <H key={`${s}-${i}`} as="button" type="button" onClick={() => setMainImg(s)} s={`flex:1;padding:0;border:2px solid ${s === active ? '#0F2D22' : 'transparent'};border-radius:16px;overflow:hidden;background:#E9E2D3;aspect-ratio:1/1;cursor:pointer;transition:border-color .2s ease`}>
                <img data-slot={`thumb-${i}-${box.slug}`} src={s} alt="" loading="lazy" />
              </H>
            ))}
          </H>
        </H>

        <div>
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#1F7F5C;font-weight:600"><H as="span" s="width:28px;height:2px;background:#3DDC84" />{box.category}</H>
          <H as="h1" data-r="h1" s="font-family:'Playfair Display',serif;font-size:54px;line-height:1.02;letter-spacing:-.03em;margin:14px 0 0;font-weight:500">{box.name}</H>
          <H as="p" s="font-size:17px;line-height:1.7;color:#4E5F57;margin:18px 0 0;max-width:50ch;font-weight:300">{box.description}</H>

          <H data-r="pricerow" s="display:flex;align-items:baseline;gap:12px;margin:28px 0 0;padding:22px 0;border-top:1px solid rgba(15,45,34,.12);border-bottom:1px solid rgba(15,45,34,.12)">
            <H as="span" s="font-family:'Playfair Display',serif;font-size:42px;color:#0F2D22;line-height:1;letter-spacing:-.02em">{box.priceLabel}</H>
            <H as="span" s="font-size:14px;color:#6B7F75">/ sản phẩm · đã gồm gia công cơ bản</H>
          </H>

          <H s="display:grid;gap:22px;margin-top:28px">
            <H s="display:grid;gap:10px">
              <H as="strong" s="font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#6B7F75">Chất liệu giấy</H>
              <H s="display:flex;gap:9px;flex-wrap:wrap">
                {papers.map((o, i) => <H key={o.id} as="button" type="button" onClick={() => setPaper(i)} s={optS(i === paper)}>{o.label}</H>)}
              </H>
            </H>
            <H s="display:grid;gap:10px">
              <H as="strong" s="font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#6B7F75">Gia công thêm</H>
              <H s="display:flex;gap:9px;flex-wrap:wrap">
                {finishes.map((o, i) => <H key={o.id} as="button" type="button" onClick={() => setFinish(i)} s={optS(i === finish)}>{o.label}</H>)}
              </H>
            </H>
            <H s="display:grid;gap:10px">
              <H as="strong" s="font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#6B7F75">Số lượng</H>
              <H data-r="qtyrow" s="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
                <H s="display:flex;align-items:center;border:1.5px solid #DDD5C4;border-radius:999px;background:#fff;overflow:hidden">
                  <H as="button" type="button" onClick={qtyDown} s="border:0;background:none;cursor:pointer;padding:12px 18px;font-size:18px;color:#0F2D22" h="background:#F4EFE4">−</H>
                  <H as="span" s="min-width:80px;text-align:center;font-weight:700;font-size:15px">{num(dQty)}</H>
                  <H as="button" type="button" onClick={qtyUp} s="border:0;background:none;cursor:pointer;padding:12px 18px;font-size:18px;color:#0F2D22" h="background:#F4EFE4">+</H>
                </H>
                <H as="span" s="font-size:13.5px;color:#6B7F75">{dQty >= 500 ? 'Đã áp dụng giảm 15% cho đơn lớn' : 'Từ 500 sản phẩm được giảm 15%'}</H>
              </H>
            </H>
          </H>

          <H s="margin-top:28px;background:#E7F5EA;color:#0F2D22;border-radius:24px;padding:26px 28px;display:grid;gap:18px;border:1px solid rgba(15,45,34,.08)">
            <H data-r="totalrow" s="display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap">
              <H as="span" s="font-size:14px;color:#4E5F57">Tạm tính {num(dQty)} × {vnd(unitFinal)}</H>
              <H as="strong" s="font-family:'Playfair Display',serif;font-size:38px;color:#1F9E63;line-height:1;letter-spacing:-.02em">{vnd(dTotal)}</H>
            </H>
            <H s="display:flex;gap:11px;flex-wrap:wrap">
              <H as="button" type="button" onClick={orderNow} s="border:0;cursor:pointer;padding:15px 26px;border-radius:999px;background:#1F9E63;color:#fff;font-weight:700;font-size:15px;transition:all .2s ease" h="background:#0F2D22">Yêu cầu báo giá chính xác</H>
              <H as="a" href={`tel:${tel}`} s="padding:15px 26px;border-radius:999px;border:1.5px solid rgba(15,45,34,.25);color:#0F2D22;font-weight:600;font-size:15px;transition:all .2s ease;background:#fff" h="background:#0F2D22;color:#fff">Gọi {site.phone}</H>
            </H>
          </H>

          <H s="margin-top:30px;border:1px solid rgba(15,45,34,.1);border-radius:20px;overflow:hidden;background:#fff">
            {specs.map((s) => (
              <H key={s.key} s="display:grid;grid-template-columns:38% 1fr;gap:16px;padding:15px 22px;border-bottom:1px solid rgba(15,45,34,.06);font-size:14.5px">
                <H as="span" s="color:#6B7F75">{s.key}</H>
                <H as="span" s="color:#0F2D22;font-weight:500">{s.value}</H>
              </H>
            ))}
          </H>
        </div>
      </H>

      <H as="section" s="max-width:1280px;margin:84px auto 0;padding:0 28px 90px">
        <H s="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap">
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:40px;margin:0;letter-spacing:-.025em;font-weight:500">Mẫu tương tự</H>
          <H as="button" type="button" onClick={goCat} s="background:none;border:0;cursor:pointer;color:#1F7F5C;font-weight:600;font-size:14.5px">Xem tất cả {box.category} →</H>
        </H>
        <H data-r="grid4" s="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:28px">
          {(data.related || []).map((p) => <ProductCard key={p.slug} product={p} variant="related" />)}
        </H>
      </H>
    </H>
  )
}
