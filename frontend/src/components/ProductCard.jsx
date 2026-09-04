import { useNavigate } from 'react-router-dom'
import H from '../ui/H'

/** Catalogue card (design: items grid). `variant="related"` = the "Mẫu tương tự" card under product detail. */
export default function ProductCard({ product: p, variant = 'grid' }) {
  const navigate = useNavigate()
  const open = () => { navigate(`/san-pham/${p.slug}`); window.scrollTo({ top: 0 }) }

  if (variant === 'related') {
    return (
      <H data-r="card" onClick={open} s="cursor:pointer;border:1px solid #EAE5D7;background:#fff;border-radius:22px;overflow:hidden;display:grid;transition:box-shadow .32s ease, transform .32s ease, border-color .32s ease" h="box-shadow:0 36px 64px -34px rgba(63,71,80,.4);transform:translateY(-6px);border-color:#BFE3CF">
        <H data-r="zoom" s="aspect-ratio:4/5;background:#EFEADC;overflow:hidden;position:relative">
          <img data-slot={`rel-${p.slug}`} src={p.imageUrl} alt={p.name} loading="lazy" />
          <H data-r="veil" s="position:absolute;inset:0;background:linear-gradient(to top,rgba(63,71,80,.55),transparent 55%);opacity:0;transition:opacity .32s ease;pointer-events:none" />
        </H>
        <H as="button" type="button" onClick={open} s="text-align:left;background:none;border:0;cursor:pointer;padding:18px;display:grid;gap:7px" h="background:#F6FBF8">
          <H as="span" s="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">{p.category}</H>
          <H as="strong" s="font-size:16.5px;font-weight:600">{p.name}</H>
          <H as="span" s="font-size:14px;color:#00A651;font-weight:600">{p.priceLabel}</H>
        </H>
      </H>
    )
  }

  return (
    <H data-r="card" onClick={open} s="border:1px solid #EAE5D7;background:#fff;border-radius:22px;overflow:hidden;display:grid;transition:box-shadow .32s cubic-bezier(.2,.8,.2,1), transform .32s cubic-bezier(.2,.8,.2,1), border-color .32s ease;cursor:pointer" h="box-shadow:0 36px 64px -34px rgba(63,71,80,.4);transform:translateY(-6px);border-color:#BFE3CF">
      <H data-r="zoom" s="aspect-ratio:4/5;background:#EFEADC;overflow:hidden;position:relative">
        <img data-slot={p.slug} src={p.imageUrl} alt={p.name} loading="lazy" />
        <H data-r="veil" s="position:absolute;inset:0;background:linear-gradient(to top,rgba(63,71,80,.55),transparent 55%);opacity:0;transition:opacity .32s ease;pointer-events:none" />
        <H as="span" data-r="cta-mini" s="position:absolute;left:14px;right:14px;bottom:14px;padding:11px;border-radius:12px;background:rgba(255,255,255,.94);color:#3F4750;font-size:13px;font-weight:600;text-align:center;transform:translateY(12px);opacity:0;transition:all .32s cubic-bezier(.2,.8,.2,1);pointer-events:none">Xem chi tiết →</H>
        <H as="span" s="position:absolute;top:12px;left:12px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.9);backdrop-filter:blur(6px);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#1F7F5C;font-weight:600">{p.category}</H>
      </H>
      <H s="padding:18px 18px 20px;display:grid;gap:6px">
        <H as="strong" s="font-size:16.5px;font-weight:600;letter-spacing:-.01em;line-height:1.3">{p.name}</H>
        <H as="span" s="font-size:14.5px;color:#00A651;font-weight:600">{p.priceLabel}</H>
      </H>
    </H>
  )
}
