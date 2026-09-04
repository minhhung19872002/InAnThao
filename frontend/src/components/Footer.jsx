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
    <H as="footer" s="background:#fff;color:#4E5F57;margin-top:110px;border-top:1px solid rgba(15,45,34,.08)">
      <H data-r="foot" s="max-width:1280px;margin:0 auto;padding:72px 28px 40px;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:44px">
        <div>
          <H as="img" src={site.logoUrl} alt="Logo An Thảo" s="height:48px;width:auto;display:block;margin-bottom:16px" />
          <H as="strong" s="font-family:'Playfair Display',serif;font-size:26px;color:#0F2D22;letter-spacing:-.01em">{site.name}</H>
          <H as="p" s="margin:12px 0 0;font-size:14.5px;line-height:1.7;max-width:38ch;font-weight:300">Nhận in thiệp cưới, tem nhãn, bao bì, catalogue, standee với số lượng lớn nhỏ. Tư vấn và thiết kế miễn phí.</H>
        </div>
        <H s="display:grid;gap:10px;align-content:start;font-size:14.5px">
          <H as="strong" s="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#1F7F5C">Liên hệ</H>
          <H as="a" href={`tel:${tel}`} s="color:#0F2D22;font-weight:700;font-size:18px">{site.phone}</H>
          <H as="a" href={`mailto:${site.email}`} s="color:#4E5F57">{site.email}</H>
          <span>{site.hours}</span>
        </H>
        <H s="display:grid;gap:10px;align-content:start;font-size:14.5px">
          <H as="strong" s="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#1F7F5C">Sản phẩm</H>
          {categories.map((c) => (
            <H key={c.slug} as="a" href="#danh-muc" onClick={go(c.slug)} s="color:#0F2D22">{c.name}</H>
          ))}
        </H>
      </H>
      <H s="border-top:1px solid rgba(15,45,34,.08);background:#F1F8F0">
        <H s="max-width:1280px;margin:0 auto;padding:18px 28px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:12.5px;color:#6B7F75">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>inanthao.com</span>
        </H>
      </H>
    </H>
  )
}
