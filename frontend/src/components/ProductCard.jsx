import { Link } from 'react-router-dom'

/** Catalogue card. `variant="related"` renders the compact body used under product detail. */
export default function ProductCard({ product, variant = 'grid' }) {
  const p = product
  return (
    <Link to={`/san-pham/${p.slug}`} className="card" onClick={() => window.scrollTo({ top: 0 })}>
      <div className="card__zoom">
        <img src={p.imageUrl} alt={p.name} loading="lazy" />
        <div className="card__veil" />
        {variant === 'grid' && (
          <>
            <span className="card__cta">Xem chi tiết →</span>
            <span className="card__tag">{p.category}</span>
          </>
        )}
      </div>
      <div className="card__body">
        {variant === 'related' && <span className="card__cat">{p.category}</span>}
        <strong className="card__name">{p.name}</strong>
        <span className="card__price">{p.priceLabel}</span>
      </div>
    </Link>
  )
}
