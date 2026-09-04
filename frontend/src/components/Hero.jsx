import H from '../ui/H'
import { useSite } from '../siteContext'

const IMG = 'https://www.inanthao.com//admin/webroot/upload/image/images/'
// Collage images exactly as in the design (v2-hero-a/b/c)
const COLLAGE = {
  a: IMG + 'thiep_cuoi_2025/25A22_thiepcuoi_inanthao.jpg',
  b: IMG + 'hop_giay/hop_giay_ep_kim_inanthao.jpg',
  c: IMG + 'decal_giay/decal_giay_2018_01_28_inanthao.jpg',
}
const fallback = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/hero.png' }

export default function Hero() {
  const { site } = useSite()
  return (
    <H as="section" id="top" s="background:linear-gradient(180deg,#F1F8F0 0%,#FBF8F2 100%);color:#0F2D22;position:relative;overflow:hidden">
      <H s="position:absolute;inset:0;background-image:linear-gradient(rgba(15,45,34,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(15,45,34,.06) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(ellipse at 70% 40%,#000 20%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse at 70% 40%,#000 20%,transparent 70%);pointer-events:none" />
      <H s="position:absolute;top:-160px;right:-80px;width:620px;height:620px;background:linear-gradient(135deg,rgba(61,220,132,.35),rgba(242,199,102,.25));filter:blur(40px);animation:blob 14s ease-in-out infinite;pointer-events:none" />
      <H s="position:absolute;bottom:-260px;left:-100px;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(214,168,75,.26),transparent 62%);pointer-events:none" />

      <H data-r="hero" s="position:relative;max-width:1280px;margin:0 auto;padding:88px 28px 96px;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center">
        <H s="animation:rise .8s cubic-bezier(.2,.8,.2,1) both">
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;padding:7px 14px 7px 8px;border-radius:999px;border:1px solid rgba(15,45,34,.12);background:#fff;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#1F7F5C;font-weight:600;white-space:nowrap">
            <H as="span" s="width:22px;height:22px;border-radius:50%;background:#3DDC84;color:#0F2D22;display:grid;place-items:center;font-size:12px;font-weight:700">✓</H>Xưởng in tại TP. HCM · từ 2019
          </H>
          <H as="h1" data-r="h1" s="font-family:'Playfair Display',serif;font-size:80px;line-height:.96;letter-spacing:-.04em;margin:28px 0 0;font-weight:500;text-wrap:balance">
            Ấn phẩm đẹp,<br />in đúng hẹn,<br />
            <H as="em" s="font-weight:400;background:linear-gradient(90deg,#1F9E63,#3DDC84 45%,#D6A84B);-webkit-background-clip:text;background-clip:text;color:transparent">giá tại xưởng.</H>
          </H>
          <H as="p" s="font-size:18px;line-height:1.65;color:#4E5F57;max-width:44ch;margin:26px 0 0;font-weight:300;text-wrap:pretty">Thiệp cưới, tem nhãn, bao bì và mọi ấn phẩm cho thương hiệu của bạn — thiết kế miễn phí, in thử trước, giao tận nơi toàn quốc.</H>
          <H s="display:flex;gap:12px;flex-wrap:wrap;margin-top:36px">
            <H as="a" href="#danh-muc" data-r="cta mag" s="display:inline-flex;align-items:center;gap:10px;padding:17px 30px;border-radius:999px;background:#1F9E63;color:#fff;font-weight:700;font-size:15px;box-shadow:0 18px 40px -16px rgba(31,158,99,.7);transition:all .22s ease" h="background:#0F2D22;color:#fff;transform:translateY(-2px)">Xem sản phẩm <H as="span" s="font-size:18px;line-height:1">→</H></H>
            <H as="a" href="#bao-gia" data-r="cta mag" s="display:inline-flex;align-items:center;padding:17px 30px;border-radius:999px;border:1.5px solid rgba(15,45,34,.2);color:#0F2D22;background:#fff;font-weight:600;font-size:15px;transition:all .22s ease" h="border-color:#0F2D22;background:#0F2D22;color:#F4EFE4">Báo giá trong 15 phút</H>
          </H>
          <H data-r="live" s="display:inline-flex;align-items:center;gap:10px;margin-top:40px;padding:8px 14px 8px 10px;border-radius:999px;background:#fff;border:1px solid rgba(15,45,34,.1);font-size:12.5px;color:#4E5F57">
            <H as="span" s="position:relative;width:10px;height:10px;display:inline-block">
              <H as="span" s="position:absolute;inset:0;border-radius:50%;background:#1F9E63" />
              <H as="span" s="position:absolute;inset:0;border-radius:50%;background:#1F9E63;animation:pulse 1.8s ease-out infinite" />
            </H>
            Xưởng đang nhận đơn · phản hồi trong 15 phút
          </H>
          <H data-r="stats" s="display:grid;grid-template-columns:repeat(3,auto);gap:36px;margin-top:28px;padding-top:28px;border-top:1px solid rgba(15,45,34,.12);justify-content:start">
            {site.stats.map((s) => (
              <div key={s.l}>
                <H s="font-family:'Playfair Display',serif;font-size:36px;line-height:1;letter-spacing:-.02em;color:#0F2D22">{s.n}</H>
                <H s="font-size:12.5px;color:#6B7F75;margin-top:7px;letter-spacing:.04em">{s.l}</H>
              </div>
            ))}
          </H>
        </H>

        <H data-r="collage" s="position:relative;height:620px;animation:rise 1s .1s cubic-bezier(.2,.8,.2,1) both">
          <H s="position:absolute;left:6%;top:8%;width:58%;height:78%;border-radius:26px;overflow:hidden;box-shadow:0 60px 100px -40px rgba(15,45,34,.45);transform:rotate(-4deg);background:#E9E2D3">
            <img data-slot="v2-hero-a" src={COLLAGE.a} alt="Ảnh thiệp cưới" onError={fallback} />
          </H>
          <H s="position:absolute;right:0;top:0;width:44%;height:46%;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(15,45,34,.4);transform:rotate(5deg);background:#E9E2D3;animation:drift 7s ease-in-out infinite">
            <img data-slot="v2-hero-b" src={COLLAGE.b} alt="Ảnh hộp giấy" onError={fallback} />
          </H>
          <H s="position:absolute;right:4%;bottom:2%;width:46%;height:44%;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(15,45,34,.4);transform:rotate(-2deg);background:#E9E2D3;animation:drift 8s 1s ease-in-out infinite">
            <img data-slot="v2-hero-c" src={COLLAGE.c} alt="Ảnh tem nhãn" onError={fallback} />
          </H>
          <H s="position:absolute;left:0;bottom:10%;background:#fff;color:#0F2D22;border-radius:18px;padding:14px 18px;box-shadow:0 30px 60px -24px rgba(15,45,34,.4)">
            <H s="font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#6B7F75">Thiệp cưới từ</H>
            <H s="font-family:'Playfair Display',serif;font-size:30px;line-height:1.1;margin-top:3px;color:#1F9E63">1.000₫</H>
          </H>
          <H data-r="badge" s="position:absolute;right:36%;top:42%;width:96px;height:96px;display:grid;place-items:center">
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, animation: 'spin 14s linear infinite' }}>
              <defs><path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"></path></defs>
              <text style={{ fontSize: '10.5px', letterSpacing: '.28em', fill: '#FFFFFF', fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, paintOrder: 'stroke', stroke: 'rgba(15,45,34,.55)', strokeWidth: '1.6px', strokeLinejoin: 'round' }}>
                <textPath href="#circ">THIẾT KẾ MIỄN PHÍ · IN THỬ TRƯỚC · </textPath>
              </text>
            </svg>
            <H as="span" s="width:46px;height:46px;border-radius:50%;background:#F2C766;display:grid;place-items:center;font-family:'Playfair Display',serif;font-style:italic;font-size:15px;color:#0F2D22;box-shadow:0 18px 34px -18px rgba(15,45,34,.6)">new</H>
          </H>
        </H>
      </H>
    </H>
  )
}
