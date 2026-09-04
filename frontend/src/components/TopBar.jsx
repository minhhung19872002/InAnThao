import { useSite } from '../siteContext'

export default function TopBar() {
  const { site } = useSite()
  const tel = site.phone.replace(/\s/g, '')
  return (
    <div className="topbar">
      <div className="topbar__inner">
        <span className="topbar__promo">
          <span className="topbar__dot" />
          Miễn phí thiết kế · Giao hàng toàn quốc
        </span>
        <span className="topbar__contacts">
          <a className="topbar__phone" href={`tel:${tel}`}>Hotline / Zalo: {site.phone}</a>
          <a className="topbar__mail" href={`mailto:${site.email}`}>{site.email}</a>
        </span>
      </div>
    </div>
  )
}
