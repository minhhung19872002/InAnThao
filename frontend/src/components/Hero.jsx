import H from '../ui/H'
import { useSite } from '../siteContext'

const HERO_IMG = 'https://www.inanthao.com//admin/webroot/upload/image/images/thiep_cuoi_ATD/ATK07_KEa_thiep_cuoi_vintage_0932733764.jpg'

export default function Hero() {
  const { site } = useSite()
  return (
    <H s="position:relative;overflow:hidden">
      <H s="position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 1px 1px,rgba(63,71,80,.07) 1px,transparent 0);background-size:26px 26px;mask-image:radial-gradient(ellipse at 20% 30%,#000 30%,transparent 75%);-webkit-mask-image:radial-gradient(ellipse at 20% 30%,#000 30%,transparent 75%)" />
      <H s="position:absolute;top:-180px;right:-120px;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(0,166,81,.13),transparent 62%);pointer-events:none" />
      <H as="section" id="top" data-r="hero" s="position:relative;max-width:1240px;margin:0 auto;padding:78px 24px 0;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center">
        <H s="animation:rise .7s cubic-bezier(.2,.8,.2,1) both">
          <H as="span" s="display:inline-flex;align-items:center;gap:9px;padding:7px 14px 7px 9px;border-radius:999px;border:1px solid #BFE3CF;background:#fff;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#1F7F5C;font-weight:600">
            <H as="span" s="width:20px;height:20px;border-radius:50%;background:#00A651;color:#fff;display:grid;place-items:center;font-size:11px">✓</H>Xưởng in trực tiếp · TP. HCM
          </H>
          <H as="h1" data-r="h1" s="font-family:'Playfair Display',serif;font-size:68px;line-height:1;letter-spacing:-.03em;margin:26px 0 0;text-wrap:balance;font-weight:500">
            In ấn tinh tế cho <H as="em" s="color:#00A651;font-style:italic;position:relative;white-space:nowrap">những dịp<H as="span" s="position:absolute;left:0;right:0;bottom:4px;height:10px;background:rgba(247,183,70,.35);z-index:-1;border-radius:2px" /></H> quan trọng
          </H>
          <H as="p" s="font-size:18px;line-height:1.65;color:#4A5158;max-width:46ch;margin:22px 0 0;text-wrap:pretty;font-weight:300">Xưởng in trực tiếp, không qua trung gian. Chọn mẫu, gửi nội dung — chúng tôi lo phần còn lại: thiết kế miễn phí, in đúng hẹn, giao tận nơi.</H>
          <H s="display:flex;gap:12px;flex-wrap:wrap;margin-top:30px">
            <H as="a" href="#danh-muc" data-r="cta" s="display:inline-flex;align-items:center;gap:10px;padding:16px 28px;border-radius:999px;background:#00A651;color:#fff;font-weight:600;font-size:15px;box-shadow:0 14px 28px -14px rgba(0,166,81,.7);transition:transform .2s ease,box-shadow .2s ease,background .2s ease" h="background:#1F7F5C;color:#fff;transform:translateY(-2px);box-shadow:0 20px 34px -14px rgba(0,166,81,.7)">Xem mẫu thiệp <H as="span" s="font-size:17px;line-height:1">→</H></H>
            <H as="a" href="#bao-gia" data-r="cta" s="display:inline-flex;align-items:center;padding:16px 28px;border-radius:999px;border:1.5px solid #DFDACA;color:#3F4750;font-weight:600;font-size:15px;background:rgba(255,255,255,.6);transition:all .2s ease" h="border-color:#3F4750;background:#3F4750;color:#FCFAED">Báo giá trong 15 phút</H>
          </H>
          <H data-r="stats" s="display:flex;gap:0;margin-top:44px;padding-top:26px;border-top:1px solid #E8E4D6">
            {site.stats.map((s) => (
              <H key={s.l} s="flex:1;padding-right:28px;border-right:1px solid #E8E4D6;margin-right:28px">
                <H s="font-family:'Playfair Display',serif;font-size:32px;line-height:1;letter-spacing:-.02em">{s.n}</H>
                <H s="font-size:12.5px;color:#8C8A7E;margin-top:6px;letter-spacing:.02em">{s.l}</H>
              </H>
            ))}
          </H>
        </H>
        <H s="position:relative;animation:rise .9s .1s cubic-bezier(.2,.8,.2,1) both">
          <H data-r="frame" s="position:absolute;inset:22px -22px -22px 22px;border:1px solid #BFE3CF;border-radius:28px" />
          <H data-r="frame" s="position:absolute;top:-14px;right:-14px;width:120px;height:120px;border-radius:50%;background:#F7B746;opacity:.9;z-index:0" />
          <H data-r="media" s="position:relative;border-radius:28px;overflow:hidden;background:#EFEADC;aspect-ratio:4/5;box-shadow:0 50px 90px -46px rgba(63,71,80,.55),0 0 0 1px rgba(63,71,80,.06)">
            <img data-slot="hero" src={HERO_IMG} alt="Thiệp cưới" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/hero.png' }} />
          </H>
          <H s="position:absolute;bottom:28px;left:-26px;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border:1px solid #E8E4D6;border-radius:18px;padding:16px 20px;box-shadow:0 24px 48px -22px rgba(63,71,80,.4);animation:drift 6s ease-in-out infinite">
            <H s="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8C8A7E">Thiệp cưới từ</H>
            <H s="font-family:'Playfair Display',serif;font-size:30px;color:#00A651;line-height:1.1;margin-top:3px">1.000₫<H as="span" s="font-size:13px;color:#8C8A7E;font-family:'Be Vietnam Pro',sans-serif;font-weight:400"> /thiệp</H></H>
          </H>
          <H s="position:absolute;top:26px;right:-18px;background:linear-gradient(135deg,#5A626B 0%,#3F4750 45%,#2E353C 100%);color:#FCFAED;border-radius:14px;padding:11px 15px;display:flex;align-items:center;gap:10px;box-shadow:0 20px 40px -22px rgba(63,71,80,.6);font-size:13px;font-weight:500">
            <H as="span" s="width:8px;height:8px;border-radius:50%;background:#8FE0AE;box-shadow:0 0 0 4px rgba(143,224,174,.25)" />Thiết kế miễn phí
          </H>
        </H>
      </H>
    </H>
  )
}
