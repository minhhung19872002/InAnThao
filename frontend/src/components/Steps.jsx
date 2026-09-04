import H from '../ui/H'
import { useSite } from '../siteContext'

export default function Steps() {
  const { site } = useSite()
  return (
    <H as="section" s="max-width:1240px;margin:0 auto;padding:78px 24px 0">
      <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#4E8F35"><H as="span" s="width:26px;height:1px;background:#4E8F35" />Quy trình</H>
      <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:44px;margin:12px 0 36px;letter-spacing:-.025em;font-weight:500;line-height:1.08">Bốn bước, từ ý tưởng đến tận tay</H>
      <H data-r="steps" s="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;position:relative">
        {site.steps.map((s) => (
          <H key={s.n} s="position:relative;background:#fff;border:1px solid #EAE5D7;border-radius:22px;padding:28px 26px 30px;display:grid;gap:12px;align-content:start;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease" h="transform:translateY(-4px);box-shadow:0 28px 50px -30px rgba(63,71,80,.35);border-color:#BFE3CF">
            <H s="display:flex;align-items:center;justify-content:space-between">
              <H as="span" s="width:46px;height:46px;border-radius:14px;background:#F2FAF6;border:1px solid #BFE3CF;display:grid;place-items:center;font-family:'Playfair Display',serif;font-size:20px;color:#1F7F5C;font-weight:600">{s.n}</H>
              <H as="span" data-r="conn" s="flex:1;height:1px;margin-left:16px;background:repeating-linear-gradient(90deg,#BFE3CF 0 6px,transparent 6px 12px)" />
            </H>
            <H as="strong" s="font-size:18px;letter-spacing:-.01em;margin-top:6px">{s.t}</H>
            <H as="p" s="margin:0;font-size:14.5px;line-height:1.65;color:#4A5158">{s.d}</H>
          </H>
        ))}
      </H>
    </H>
  )
}
