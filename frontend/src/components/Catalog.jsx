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
  const catTitle = cat ? (categories.find((c) => c.slug === cat)?.name || 'Tất cả mẫu đang có') : 'Tất cả mẫu đang có'

  return (
    <H as="section" id="danh-muc" data-reveal="" s="max-width:1280px;margin:0 auto;padding:104px 28px 0">
      <H s="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end;justify-content:space-between">
        <div>
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#1F7F5C;font-weight:600"><H as="span" s="width:28px;height:2px;background:#3DDC84" />Mẫu sản phẩm</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:50px;margin:12px 0 0;letter-spacing:-.03em;font-weight:500;line-height:1.02">{catTitle}</H>
        </div>
        <H data-r="cats" s="display:flex;gap:4px;flex-wrap:wrap;padding:5px;background:#fff;border:1px solid rgba(15,45,34,.08);border-radius:999px">
          {cats.map((c) => {
            const active = c.slug === cat
            return (
              <H key={c.slug || 'all'} as="button" type="button" onClick={() => pick(c.slug)} s={`border:0;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:13.5px;font-weight:600;transition:all .2s ease;background:${active ? '#0F2D22' : 'transparent'};color:${active ? '#F4EFE4' : '#4E5F57'}`}>{c.name}</H>
            )
          })}
        </H>
      </H>

      <H data-r="grid4" s="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:36px">
        {loading && items.length === 0 && Array.from({ length: 8 }).map((_, i) => (
          <H key={i} s="background:#fff;border:1px solid rgba(15,45,34,.08);border-radius:24px;overflow:hidden"><H s="aspect-ratio:4/5;background:#E9E2D3" /><H s="height:78px" /></H>
        ))}
        {!loading && error && <H s="grid-column:1/-1;padding:40px;text-align:center;color:#6B7F75">Không tải được danh sách sản phẩm. Vui lòng thử lại sau.</H>}
        {!loading && !error && items.length === 0 && <H s="grid-column:1/-1;padding:40px;text-align:center;color:#6B7F75">Chưa có sản phẩm trong danh mục này.</H>}
        {items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </H>
    </H>
  )
}
