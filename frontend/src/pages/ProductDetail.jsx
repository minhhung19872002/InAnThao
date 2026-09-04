import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, num, vnd } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'
import H from '../ui/H'

/** The `detail` branch of the design (breadcrumb, gallery, options, pricing box, specs, related). */
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

  if (loading) return <H s="max-width:1240px;margin:0 auto;padding:60px 24px;color:#8C8A7E">Đang tải sản phẩm…</H>
  if (error || !box) {
    return (
      <H s="max-width:720px;margin:80px auto;padding:0 24px;text-align:center">
        <H as="h1" data-r="h2" s="font-family:'Playfair Display',serif;font-size:44px;margin:0 0 12px;letter-spacing:-.025em;font-weight:500">Không tìm thấy sản phẩm</H>
        <H as="p" s="color:#4A5158;margin:0 0 24px">Mẫu này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</H>
        <H as="button" type="button" onClick={goHome} s="border:0;cursor:pointer;padding:14px 24px;border-radius:999px;background:#00A651;color:#fff;font-weight:600;font-size:15px">Về trang chủ</H>
      </H>
    )
  }

  const specs = [
    ...(data.specs || []),
    { key: 'Chất liệu đã chọn', value: papers[paper]?.label || '—' },
    { key: 'Gia công đã chọn', value: finishes[finish]?.label || '—' },
  ]
  const tel = site.phone.replace(/\s/g, '')
  const optS = (on) => `cursor:pointer;padding:11px 17px;border-radius:12px;border:1px solid ${on ? '#00A651' : '#DFDACA'};background:${on ? '#F2FAF6' : '#fff'};color:${on ? '#1F7F5C' : '#4A5158'};font-size:14px;font-weight:500;transition:all .18s ease`

  return (
    <H s="animation:floatUp .26s ease both">
      <H s="max-width:1240px;margin:0 auto;padding:26px 24px 0;display:flex;align-items:center;gap:10px;font-size:13.5px;color:#8C8A7E">
        <H as="button" type="button" onClick={goHome} s="background:none;border:0;padding:0;cursor:pointer;color:#00A651;font-weight:600">Trang chủ</H>
        <span>/</span>
        <H as="button" type="button" onClick={goCat} s="background:none;border:0;padding:0;cursor:pointer;color:#00A651;font-weight:600">{box.category}</H>
        <span>/</span>
        <H as="span" s="color:#4A5158">{box.name}</H>
      </H>

      <H as="section" data-r="two" s="max-width:1240px;margin:0 auto;padding:26px 24px 0;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start">
        <H data-r="sticky" s="display:grid;gap:14px;position:sticky;top:104px">
          <H data-r="media" s="position:relative;border-radius:24px;overflow:hidden;background:#EFEADC;aspect-ratio:4/5;box-shadow:0 40px 80px -46px rgba(63,71,80,.5)">
            <img data-slot={`detail-main-${box.slug}`} src={active} alt={box.name} />
          </H>
          <H data-r="thumbs" s="display:flex;gap:12px">
            {srcs.map((s, i) => (
              <H key={`${s}-${i}`} as="button" type="button" onClick={() => setMainImg(s)} s={`flex:1;padding:0;border:2px solid ${s === active ? '#00A651' : '#E8E4D6'};border-radius:14px;overflow:hidden;background:#EFEADC;aspect-ratio:1/1;cursor:pointer;transition:border-color .2s ease`}>
                <img data-slot={`thumb-${i}-${box.slug}`} src={s} alt="" loading="lazy" />
              </H>
            ))}
          </H>
        </H>

        <div>
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#4E8F35"><H as="span" s="width:26px;height:1px;background:#4E8F35" />{box.category}</H>
          <H as="h1" data-r="h1" s="font-family:'Playfair Display',serif;font-size:48px;line-height:1.05;letter-spacing:-.02em;margin:14px 0 0">{box.name}</H>
          <H as="p" s="font-size:17px;line-height:1.7;color:#4A5158;margin:16px 0 0;max-width:50ch;text-wrap:pretty">{box.description}</H>

          <H s="display:flex;align-items:baseline;gap:12px;margin:26px 0 0;padding:20px 0;border-top:1px solid #E8E4D6;border-bottom:1px solid #E8E4D6">
            <H as="span" s="font-family:'Playfair Display',serif;font-size:38px;color:#00A651;line-height:1">{box.priceLabel}</H>
            <H as="span" s="font-size:14px;color:#8C8A7E">/ sản phẩm · đã gồm gia công cơ bản</H>
          </H>

          <H s="display:grid;gap:20px;margin-top:26px">
            <H s="display:grid;gap:9px">
              <H as="strong" s="font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Chất liệu giấy</H>
              <H s="display:flex;gap:9px;flex-wrap:wrap">
                {papers.map((o, i) => <H key={o.id} as="button" type="button" onClick={() => setPaper(i)} s={optS(i === paper)}>{o.label}</H>)}
              </H>
            </H>
            <H s="display:grid;gap:9px">
              <H as="strong" s="font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Gia công thêm</H>
              <H s="display:flex;gap:9px;flex-wrap:wrap">
                {finishes.map((o, i) => <H key={o.id} as="button" type="button" onClick={() => setFinish(i)} s={optS(i === finish)}>{o.label}</H>)}
              </H>
            </H>
            <H s="display:grid;gap:9px">
              <H as="strong" s="font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Số lượng</H>
              <H s="display:flex;align-items:center;gap:14px">
                <H s="display:flex;align-items:center;border:1px solid #DFDACA;border-radius:12px;background:#fff;overflow:hidden">
                  <H as="button" type="button" onClick={qtyDown} s="border:0;background:none;cursor:pointer;padding:12px 17px;font-size:17px;color:#4A5158" h="background:#F1F5EF">−</H>
                  <H as="span" s="min-width:78px;text-align:center;font-weight:600;font-size:15px">{num(dQty)}</H>
                  <H as="button" type="button" onClick={qtyUp} s="border:0;background:none;cursor:pointer;padding:12px 17px;font-size:17px;color:#4A5158" h="background:#F1F5EF">+</H>
                </H>
                <H as="span" s="font-size:13.5px;color:#8C8A7E">{dQty >= 500 ? 'Đã áp dụng giảm 15% cho đơn lớn' : 'Từ 500 sản phẩm được giảm 15%'}</H>
              </H>
            </H>
          </H>

          <H s="margin-top:26px;background:linear-gradient(135deg,#5A626B 0%,#3F4750 45%,#2E353C 100%);color:#FCFAED;border-radius:20px;padding:24px 26px;display:grid;gap:16px">
            <H s="display:flex;align-items:baseline;justify-content:space-between;gap:16px">
              <H as="span" s="font-size:14px;color:#ABADA4">Tạm tính {num(dQty)} × {vnd(unitFinal)}</H>
              <H as="strong" s="font-family:'Playfair Display',serif;font-size:34px;color:#8FE0AE;line-height:1">{vnd(dTotal)}</H>
            </H>
            <H s="display:flex;gap:11px;flex-wrap:wrap">
              <H as="button" type="button" onClick={orderNow} s="border:0;cursor:pointer;padding:14px 24px;border-radius:999px;background:#00A651;color:#fff;font-weight:600;font-size:15px" h="background:#22BC6B">Yêu cầu báo giá chính xác</H>
              <H as="a" href={`tel:${tel}`} s="padding:14px 24px;border-radius:999px;border:1px solid rgba(248,247,243,.35);color:#FCFAED;font-weight:600;font-size:15px" h="background:#FCFAED;color:#3F4750">Gọi {site.phone}</H>
            </H>
          </H>

          <H s="margin-top:30px;border:1px solid #E8E4D6;border-radius:18px;overflow:hidden;background:#fff">
            {specs.map((s) => (
              <H key={s.key} s="display:grid;grid-template-columns:38% 1fr;gap:16px;padding:14px 20px;border-bottom:1px solid #F1EEE2;font-size:14.5px">
                <H as="span" s="color:#8C8A7E">{s.key}</H>
                <H as="span" s="color:#383E44">{s.value}</H>
              </H>
            ))}
          </H>
        </div>
      </H>

      <H as="section" s="max-width:1240px;margin:74px auto 0;padding:0 24px">
        <H s="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap">
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:34px;margin:0;letter-spacing:-.015em">Mẫu tương tự</H>
          <H as="button" type="button" onClick={goCat} s="background:none;border:0;cursor:pointer;color:#00A651;font-weight:600;font-size:14.5px">Xem tất cả {box.category} →</H>
        </H>
        <H data-r="grid4" s="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:26px">
          {(data.related || []).map((p) => <ProductCard key={p.slug} product={p} variant="related" />)}
        </H>
        <H s="height:80px" />
      </H>
    </H>
  )
}
