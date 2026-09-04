import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useApi } from '../hooks/useApi'
import { useSite } from '../siteContext'
import H from '../ui/H'

const IMG = 'https://www.inanthao.com//admin/webroot/upload/image/images/'
/** Presentation config from the design's BENTO constant, keyed by category slug. */
const BENTO = {
  'thiep-cuoi': { sub: '8 bộ sưu tập · ép kim, cấn bế, in hình', img: IMG + 'thiep_cuoi_ATK/ATK24a_inanthao.jpg' },
  'bao-bi': { sub: 'Hộp giấy cứng, túi, ly nhựa', img: IMG + 'hop_giay/hop_giay_ep_kim_inanthao.jpg' },
  'tem-nhan': { sub: 'Decal giấy, nhựa, trong', img: IMG + 'decal_giay/decal_giay_2018_01_28_inanthao.jpg' },
  'an-pham': { sub: 'Card, menu, hoá đơn', img: IMG + 'name_card/namecard_20210523_inanthao_v.jpg' },
}
const ORDER = ['thiep-cuoi', 'bao-bi', 'tem-nhan', 'an-pham']
const CELLS = [
  { col: '1 / span 2', row: '1 / span 2', size: '40px' },
  { col: '3 / span 2', row: '1', size: '28px' },
  { col: '3', row: '2', size: '24px' },
  { col: '4', row: '2', size: '24px' },
]

/** "Dịch vụ" section: 4 category tiles in a bento grid (design: `bento`). */
export default function Bento() {
  const { categories } = useSite()
  const navigate = useNavigate()
  const { data: all } = useApi(() => api.products(''), [], { fallback: [] })

  const tiles = [...categories]
    .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))
    .slice(0, 4)
    .map((c, i) => {
      const own = all.filter((p) => p.categorySlug === c.slug)
      const cfg = BENTO[c.slug] || {}
      return {
        ...CELLS[i],
        slug: c.slug,
        label: c.name,
        sub: cfg.sub || (c.subLabels || []).join(', '),
        img: cfg.img || own[0]?.imageUrl || '/hero.png',
        count: own.length + ' mẫu',
      }
    })

  const pick = (slug) => {
    navigate(`/?cat=${slug}`)
    setTimeout(() => { const el = document.getElementById('danh-muc'); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }) }, 30)
  }

  return (
    <H as="section" data-reveal="" s="max-width:1280px;margin:0 auto;padding:72px 28px 0">
      <H s="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:34px">
        <div>
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#1F7F5C;font-weight:600"><H as="span" s="width:28px;height:2px;background:#3DDC84" />Dịch vụ</H>
          <H as="h2" data-r="h2" s="position:relative;font-family:'Playfair Display',serif;font-size:50px;margin:12px 0 0;letter-spacing:-.03em;font-weight:500;line-height:1.02">
            Bốn dòng ấn phẩm,<br />một xưởng làm hết
            <H as="span" aria-hidden="true" data-r="ghost" s="position:absolute;left:-6px;top:-54px;font-size:150px;line-height:1;font-style:italic;color:transparent;-webkit-text-stroke:1px rgba(15,45,34,.14);pointer-events:none;white-space:nowrap;z-index:-1">Studio</H>
          </H>
        </div>
        <H as="p" s="margin:0;max-width:38ch;font-size:15.5px;line-height:1.65;color:#4E5F57;font-weight:300">Chọn nhóm bạn cần — mỗi nhóm có mẫu sẵn, bảng giá và tuỳ chọn chất liệu riêng.</H>
      </H>
      <H data-r="bento" s="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:300px 300px;gap:18px">
        {tiles.map((b) => (
          <H key={b.slug} as="button" type="button" data-r="card" onClick={() => pick(b.slug)} s={`grid-column:${b.col};grid-row:${b.row};position:relative;border:0;padding:0;border-radius:26px;overflow:hidden;cursor:pointer;background:#E9E2D3;text-align:left;color:#fff;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease`} h="transform:translateY(-6px);box-shadow:0 40px 70px -36px rgba(15,45,34,.5)">
            <H data-r="zoom" s="position:absolute;inset:0"><img data-slot={`bento-${b.slug}`} src={b.img} alt={`Ảnh ${b.label}`} loading="lazy" /></H>
            <H s="position:absolute;inset:0;background:linear-gradient(to top,rgba(31,127,92,.88) 0%,rgba(31,127,92,.3) 50%,rgba(31,127,92,0) 100%)" />
            <H s="position:absolute;left:24px;right:24px;bottom:22px;display:grid;gap:8px">
              <H as="span" s="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#F2C766;font-weight:700">{b.count}</H>
              <H as="strong" s={`font-family:'Playfair Display',serif;font-size:${b.size};line-height:1.05;letter-spacing:-.02em;font-weight:500`}>{b.label}</H>
              <H as="span" s="font-size:13.5px;color:rgba(255,255,255,.85);font-weight:300">{b.sub}</H>
            </H>
            <H as="span" s="position:absolute;top:18px;right:18px;width:42px;height:42px;border-radius:50%;background:rgba(244,239,228,.14);backdrop-filter:blur(8px);display:grid;place-items:center;font-size:18px;color:#F4EFE4">↗</H>
            <div data-r="glare" />
          </H>
        ))}
      </H>
    </H>
  )
}
