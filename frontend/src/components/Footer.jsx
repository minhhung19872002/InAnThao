import { useNavigate } from 'react-router-dom'
import H from '../ui/H'
import { useSite } from '../siteContext'

export default function Footer() {
  const { site, categories } = useSite()
  const navigate = useNavigate()
  const tel = site.phone.replace(/\s/g, '')
  const go = (slug) => (e) => {
    e.preventDefault()
    navigate(`/?cat=${slug}`)
    setTimeout(() => { const el = document.getElementById('danh-muc'); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' }) }, 60)
  }
  return (
    <H as="footer" data-r="foot" s="max-width:1240px;margin:0 auto;padding:64px 24px 40px;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:44px;border-top:1px solid #E8E4D6;margin-top:88px">
      <div>
        <H as="img" src={site.logoUrl} alt="Logo Xưởng In An Thảo" s="height:48px;width:auto;display:block;margin-bottom:14px" />
        <H as="strong" s="font-family:'Playfair Display',serif;font-size:22px;letter-spacing:-.01em">{site.name}</H>
        <H as="p" s="margin:12px 0 0;font-size:14.5px;line-height:1.7;color:#4A5158;max-width:38ch">Nhận in thiệp cưới, tem nhãn, bao bì, catalogue, standee với số lượng lớn nhỏ. Tư vấn và thiết kế miễn phí.</H>
      </div>
      <H s="display:grid;gap:9px;align-content:start;font-size:14.5px;color:#4A5158">
        <H as="strong" s="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Liên hệ</H>
        <H as="a" href={`tel:${tel}`} s="color:#3F4750">{site.phone}</H>
        <H as="a" href={`mailto:${site.email}`} s="color:#3F4750">{site.email}</H>
        <span>{site.hours}</span>
      </H>
      <H s="display:grid;gap:9px;align-content:start;font-size:14.5px;color:#4A5158">
        <H as="strong" s="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Sản phẩm</H>
        {categories.map((c) => (
          <H key={c.slug} as="a" href="#danh-muc" onClick={go(c.slug)} s="color:#3F4750">{c.name}</H>
        ))}
      </H>
    </H>
  )
}
