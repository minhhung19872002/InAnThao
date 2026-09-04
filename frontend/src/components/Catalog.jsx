import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'
import H from '../ui/H'
import ProductCard from './ProductCard'

export default function Catalog() {
  const { categories } = useSite()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || ''
  const { data: items, loading, error } = useApi(() => api.products(cat), [cat], { fallback: [] })

  const pick = (slug) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('cat', slug)
    else next.delete('cat')
    setParams(next, { replace: true })
  }
  const cats = [{ name: 'Tất cả', slug: '' }, ...categories]

  return (
    <H as="section" id="danh-muc" s="max-width:1240px;margin:0 auto;padding:72px 24px 0">
      <H s="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end;justify-content:space-between">
        <div>
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#4E8F35"><H as="span" s="width:26px;height:1px;background:#4E8F35" />Danh mục sản phẩm</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:44px;margin:12px 0 0;letter-spacing:-.025em;font-weight:500;line-height:1.08">Chọn loại ấn phẩm bạn cần</H>
        </div>
        <H data-r="cats" s="display:flex;gap:6px;flex-wrap:wrap;padding:5px;background:#ECF3EA;border-radius:999px">
          {cats.map((c) => {
            const active = c.slug === cat
            return (
              <H key={c.slug || 'all'} as="button" type="button" onClick={() => pick(c.slug)} s={`border:0;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:500;transition:background .2s ease,color .2s ease;background:${active ? '#00A651' : 'transparent'};color:${active ? '#fff' : '#4A5158'};box-shadow:${active ? '0 8px 18px -8px rgba(0,166,81,.65)' : 'none'}`}>{c.name}</H>
            )
          })}
        </H>
      </H>

      <H data-r="grid4" s="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:34px">
        {loading && items.length === 0 && Array.from({ length: 8 }).map((_, i) => (
          <H key={i} s="border:1px solid #EAE5D7;background:#fff;border-radius:22px;overflow:hidden"><H s="aspect-ratio:4/5;background:#EFEADC" /><H s="height:78px" /></H>
        ))}
        {!loading && error && <H s="grid-column:1/-1;padding:40px;text-align:center;color:#8C8A7E">Không tải được danh sách sản phẩm. Vui lòng thử lại sau.</H>}
        {!loading && !error && items.length === 0 && <H s="grid-column:1/-1;padding:40px;text-align:center;color:#8C8A7E">Chưa có sản phẩm trong danh mục này.</H>}
        {items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </H>
    </H>
  )
}
