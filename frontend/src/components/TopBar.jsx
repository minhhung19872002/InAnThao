import H from '../ui/H'
import { useSite } from '../siteContext'

export default function TopBar() {
  const { site } = useSite()
  const tel = site.phone.replace(/\s/g, '')
  return (
    <H s="background:#67AB40;color:#F4FBEE;font-size:13px">
      <H data-r="topbar" s="max-width:1240px;margin:0 auto;padding:9px 24px;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between">
        <H as="span" s="display:flex;gap:9px;align-items:center">
          <H as="span" s="width:6px;height:6px;border-radius:50%;background:#F7B746" />
          Miễn phí thiết kế · Giao hàng toàn quốc
        </H>
        <H as="span" s="display:flex;gap:20px;align-items:center">
          <H as="a" href={`tel:${tel}`} s="color:#fff;font-weight:600">Hotline / Zalo: {site.phone}</H>
          <H as="a" href={`mailto:${site.email}`} s="color:#C8E9D3">{site.email}</H>
        </H>
      </H>
    </H>
  )
}
