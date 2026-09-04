import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, num, vnd } from '../api/client'
import ProductCard from '../components/ProductCard'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'

const DISCOUNT_QTY = 500
const DISCOUNT = 0.15

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { site } = useSite()
  const { data, loading, error } = useApi(() => api.product(slug), [slug])

  const [mainImg, setMainImg] = useState(null)
  const [paper, setPaper] = useState(0)
  const [finish, setFinish] = useState(0)
  const [qty, setQty] = useState(300)

  useEffect(() => {
    setMainImg(null)
    setPaper(0)
    setFinish(0)
    setQty(300)
    window.scrollTo({ top: 0 })
  }, [slug])

  const product = data?.product
  const papers = data?.paperOptions || []
  const finishes = data?.finishes || []
  const gallery = data?.gallery || []
  const active = mainImg || gallery[0]

  const { unit, total } = useMemo(() => {
    const base = product?.basePrice || 0
    const pm = papers[paper]?.multiplier ?? 1
    const fm = finishes[finish]?.multiplier ?? 1
    const u = Math.round(base * pm * fm)
    return { unit: u, total: u * qty * (qty >= DISCOUNT_QTY ? 1 - DISCOUNT : 1) }
  }, [product, papers, finishes, paper, finish, qty])

  const qtyUp = () => setQty((q) => Math.min(5000, q + (q >= 500 ? 100 : 50)))
  const qtyDown = () => setQty((q) => Math.max(50, q - (q > 500 ? 100 : 50)))

  const goCat = () => navigate(`/?cat=${product.categorySlug}`, { state: { scrollTo: 'danh-muc' } })
  const orderNow = () =>
    navigate('/', {
      state: {
        scrollTo: 'bao-gia',
        quote: {
          product: product.category,
          productSlug: product.slug,
          productName: product.name,
          paper: papers[paper]?.label,
          finish: finishes[finish]?.label,
          unitPrice: unit,
          qty,
        },
      },
    })

  if (loading) return <div className="notfound" style={{ color: '#8C8A7E' }}>Đang tải sản phẩm…</div>
  if (error || !product) {
    return (
      <div className="notfound">
        <h1 className="h2">Không tìm thấy sản phẩm</h1>
        <p style={{ color: '#4A5158' }}>Mẫu này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link to="/" className="btn-pill cta-primary">Về trang chủ</Link>
      </div>
    )
  }

  const specs = [
    ...(data.specs || []),
    { key: 'Chất liệu đã chọn', value: papers[paper]?.label || '—' },
    { key: 'Gia công đã chọn', value: finishes[finish]?.label || '—' },
  ]
  const tel = site.phone.replace(/\s/g, '')

  return (
    <div className="detail">
      <div className="crumbs">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <button type="button" onClick={goCat}>{product.category}</button>
        <span>/</span>
        <span className="cur">{product.name}</span>
      </div>

      <section className="detail__grid">
        <div className="gallery">
          <div className="media gallery__main">
            <img src={active} alt={product.name} />
          </div>
          <div className="thumbs">
            {gallery.map((src, i) => (
              <button
                type="button"
                key={`${src}-${i}`}
                className={`thumb${src === active ? ' is-active' : ''}`}
                onClick={() => setMainImg(src)}
                aria-label={`Ảnh ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="eyebrow">{product.category}</span>
          <h1 className="detail__h1">{product.name}</h1>
          <p className="detail__desc">{product.description}</p>

          <div className="detail__price">
            <strong>{product.priceLabel}</strong>
            <span>/ sản phẩm · đã gồm gia công cơ bản</span>
          </div>

          <div className="opts">
            <div className="opt">
              <strong className="opt__title">Chất liệu giấy</strong>
              <div className="chips">
                {papers.map((o, i) => (
                  <button type="button" key={o.id} className={`chip${i === paper ? ' is-active' : ''}`} onClick={() => setPaper(i)}>{o.label}</button>
                ))}
              </div>
            </div>
            <div className="opt">
              <strong className="opt__title">Gia công thêm</strong>
              <div className="chips">
                {finishes.map((o, i) => (
                  <button type="button" key={o.id} className={`chip${i === finish ? ' is-active' : ''}`} onClick={() => setFinish(i)}>{o.label}</button>
                ))}
              </div>
            </div>
            <div className="opt">
              <strong className="opt__title">Số lượng</strong>
              <div className="qty">
                <div className="qty__box">
                  <button type="button" onClick={qtyDown} aria-label="Giảm">−</button>
                  <span>{num(qty)}</span>
                  <button type="button" onClick={qtyUp} aria-label="Tăng">+</button>
                </div>
                <span className="qty__note">{qty >= DISCOUNT_QTY ? 'Đã áp dụng giảm 15% cho đơn lớn' : 'Từ 500 sản phẩm được giảm 15%'}</span>
              </div>
            </div>
          </div>

          <div className="total">
            <div className="total__row">
              <span>Tạm tính {num(qty)} × {vnd(unit)}</span>
              <strong>{vnd(total)}</strong>
            </div>
            <div className="total__actions">
              <button type="button" className="btn-pill total__order" onClick={orderNow}>Yêu cầu báo giá chính xác</button>
              <a href={`tel:${tel}`} className="total__call">Gọi {site.phone}</a>
            </div>
          </div>

          <div className="specs">
            {specs.map((s) => (
              <div className="spec" key={s.key}><span>{s.key}</span><span>{s.value}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="related">
        <div className="related__head">
          <h2 className="h2">Mẫu tương tự</h2>
          <button type="button" className="link-btn" onClick={goCat}>Xem tất cả {product.category} →</button>
        </div>
        <div className="grid4">
          {(data.related || []).map((p) => <ProductCard key={p.slug} product={p} variant="related" />)}
        </div>
        <div className="spacer" />
      </section>
    </div>
  )
}
