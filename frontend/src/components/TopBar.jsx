import H from '../ui/H'
import { useSite } from '../siteContext'

export default function TopBar() {
  const { site } = useSite()
  const tel = site.phone.replace(/\s/g, '')
  return (
    <H data-r="topbar" s="background:#E7F5EA;color:#3E5A4C;font-size:12.5px;letter-spacing:.02em;border-bottom:1px solid rgba(15,45,34,.06)">
      <H s="max-width:1280px;margin:0 auto;padding:9px 28px;display:flex;gap:18px;align-items:center;justify-content:space-between">
        <H as="span" s="display:flex;gap:9px;align-items:center">
          <H as="span" s="width:6px;height:6px;border-radius:50%;background:#3DDC84" />
          Xưởng in trực tiếp · Thiết kế miễn phí · Giao toàn quốc
        </H>
        <H as="span" s="display:flex;gap:20px;align-items:center;flex-shrink:0">
          <H as="a" href={`tel:${tel}`} s="color:#0F2D22;font-weight:700;white-space:nowrap">{site.phone}</H>
          <H as="a" href={`mailto:${site.email}`} s="color:#3E5A4C;white-space:nowrap">{site.email}</H>
        </H>
      </H>
    </H>
  )
}
