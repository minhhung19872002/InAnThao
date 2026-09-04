import { useNavigate } from 'react-router-dom'
import H from '../ui/H'

/** Catalogue card (design: items grid). `variant="related"` = the "Mẫu tương tự" card under product detail. */
export default function ProductCard({ product: p, variant = 'grid' }) {
  const navigate = useNavigate()
  const open = () => { navigate(`/san-pham/${p.slug}`); window.scrollTo({ top: 0 }) }

  if (variant === 'related') {
    return (
      <H data-r="card" onClick={open} s="cursor:pointer;background:#fff;border:1px solid rgba(15,45,34,.08);border-radius:24px;overflow:hidden;display:grid;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease" h="transform:translateY(-6px);box-shadow:0 40px 70px -40px rgba(15,45,34,.45)">
        <H data-r="zoom" s="aspect-ratio:4/5;background:#E9E2D3;overflow:hidden;position:relative">
          <img data-slot={`rel-${p.slug}`} src={p.imageUrl} alt={p.name} loading="lazy" />
          <H data-r="veil" s="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,45,34,.7),transparent 55%);opacity:0;transition:opacity .35s ease;pointer-events:none" />
        </H>
        <H s="padding:18px;display:flex;justify-content:space-between;gap:12px">
          <H as="strong" s="font-size:16px;font-weight:600;letter-spacing:-.01em">{p.name}</H>
          <H as="span" data-r="price" s="font-size:13.5px;color:#1F7F5C;font-weight:700;white-space:nowrap">{p.priceLabel}</H>
        </H>
      </H>
    )
  }

  return (
    <H data-r="card" onClick={open} s="cursor:pointer;background:#fff;border:1px solid rgba(15,45,34,.08);border-radius:24px;overflow:hidden;display:grid;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease" h="transform:translateY(-6px);box-shadow:0 40px 70px -40px rgba(15,45,34,.45)">
      <H data-r="zoom" s="aspect-ratio:4/5;background:#E9E2D3;overflow:hidden;position:relative">
        <img data-slot={p.slug} src={p.imageUrl} alt={p.name} loading="lazy" />
        <H data-r="veil" s="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,45,34,.7),transparent 55%);opacity:0;transition:opacity .35s ease;pointer-events:none" />
        <H as="span" data-r="mini" s="position:absolute;left:14px;right:14px;bottom:14px;padding:12px;border-radius:14px;background:#F2C766;color:#0F2D22;font-size:13px;font-weight:700;text-align:center;opacity:0;transform:translateY(12px);transition:all .35s cubic-bezier(.2,.8,.2,1);pointer-events:none">Xem chi tiết →</H>
        <H as="span" data-r="tag" s="position:absolute;top:12px;left:12px;padding:6px 11px;border-radius:999px;background:rgba(244,239,228,.92);backdrop-filter:blur(6px);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#0F2D22;font-weight:600">{p.category}</H>
        <div data-r="glare" />
      </H>
      <H s="padding:18px 18px 20px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
        <H as="strong" s="font-size:16px;font-weight:600;letter-spacing:-.01em;line-height:1.3">{p.name}</H>
        <H as="span" data-r="price" s="font-size:13.5px;color:#1F7F5C;font-weight:700;white-space:nowrap;padding-top:2px">{p.priceLabel}</H>
      </H>
    </H>
  )
}
