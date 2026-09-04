import { Link } from 'react-router-dom'
import { useSite } from '../siteContext'

export default function Footer() {
  const { site, categories } = useSite()
  const tel = site.phone.replace(/\s/g, '')
  return (
    <footer className="foot">
      <div>
        <img src={site.logoUrl} alt="Logo Xưởng In An Thảo" className="foot__logo" />
        <strong className="foot__name">{site.name}</strong>
        <p className="foot__p">Nhận in thiệp cưới, tem nhãn, bao bì, catalogue, standee với số lượng lớn nhỏ. Tư vấn và thiết kế miễn phí.</p>
      </div>
      <div className="foot__col">
        <strong className="foot__title">Liên hệ</strong>
        <a href={`tel:${tel}`}>{site.phone}</a>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span>{site.hours}</span>
      </div>
      <div className="foot__col">
        <strong className="foot__title">Sản phẩm</strong>
        {categories.map((c) => (
          <Link key={c.slug} to={`/?cat=${c.slug}#danh-muc`}>{c.name}</Link>
        ))}
      </div>
      <div className="foot__copy">© {new Date().getFullYear()} {site.name} · inanthao.com</div>
    </footer>
  )
}
