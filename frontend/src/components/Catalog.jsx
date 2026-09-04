import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'
import ProductCard from './ProductCard'

const ALL = 'Tất cả'

export default function Catalog() {
  const { categories } = useSite()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || ''
  const { data: products, loading, error } = useApi(() => api.products(cat), [cat], { fallback: [] })

  const pick = (slug) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('cat', slug)
    else next.delete('cat')
    setParams(next, { replace: true })
  }

  const tabs = [{ name: ALL, slug: '' }, ...categories]

  return (
    <section id="danh-muc" className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Danh mục sản phẩm</span>
          <h2 className="h2">Chọn loại ấn phẩm bạn cần</h2>
        </div>
        <div className="cats" role="tablist">
          {tabs.map((c) => (
            <button
              type="button"
              role="tab"
              key={c.slug || ALL}
              aria-selected={cat === c.slug}
              className={`cats__btn${cat === c.slug ? ' is-active' : ''}`}
              onClick={() => pick(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid4">
        {loading && products.length === 0 && Array.from({ length: 8 }).map((_, i) => <div className="skeleton" key={i} />)}
        {!loading && error && <div className="empty">Không tải được danh sách sản phẩm. Vui lòng thử lại sau.</div>}
        {!loading && !error && products.length === 0 && <div className="empty">Chưa có sản phẩm trong danh mục này.</div>}
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  )
}
