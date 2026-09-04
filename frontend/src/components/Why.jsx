import H from '../ui/H'
import { useSite } from '../siteContext'

export default function Why() {
  const { site } = useSite()
  return (
    <H as="section" s="max-width:1240px;margin:0 auto;padding:84px 24px 0">
      <H data-r="two" s="display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:start">
        <H s="position:sticky;top:110px">
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#4E8F35"><H as="span" s="width:26px;height:1px;background:#4E8F35" />Vì sao chọn An Thảo</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:44px;margin:12px 0 18px;letter-spacing:-.025em;font-weight:500;line-height:1.08">Làm việc thẳng với xưởng, mọi thứ rõ ràng hơn</H>
          <H as="p" s="margin:0;font-size:16px;line-height:1.7;color:#4A5158;max-width:40ch;font-weight:300">Không qua đại lý nên giá tốt hơn, sửa file nhanh hơn và bạn luôn biết đơn của mình đang ở bước nào.</H>
        </H>
        <H data-r="why" s="display:grid;grid-template-columns:1fr 1fr;gap:18px">
          {site.why.map((w) => (
            <H key={w.n} s="background:#fff;border:1px solid #EAE5D7;border-radius:20px;padding:26px;display:grid;gap:10px;align-content:start;transition:border-color .25s ease,transform .25s ease" h="border-color:#BFE3CF;transform:translateY(-3px)">
              <H as="span" s="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#5A626B 0%,#3F4750 45%,#2E353C 100%);color:#F7B746;display:grid;place-items:center;font-family:'Playfair Display',serif;font-size:19px;font-weight:600">{w.n}</H>
              <H as="strong" s="font-size:16.5px;letter-spacing:-.01em;margin-top:4px">{w.t}</H>
              <H as="p" s="margin:0;font-size:14px;line-height:1.65;color:#4A5158">{w.d}</H>
            </H>
          ))}
        </H>
      </H>
    </H>
  )
}
