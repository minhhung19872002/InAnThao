import { useSite } from '../siteContext'

export default function Ticker() {
  const { site } = useSite()
  const items = [...site.ticker, ...site.ticker]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((t, i) => (
          <span className="ticker__item" key={`${t}-${i}`}>{t} ·<i /></span>
        ))}
      </div>
    </div>
  )
}
