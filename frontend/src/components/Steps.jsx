import { useLocation, useNavigate } from 'react-router-dom'
import H from '../ui/H'
import { useSite } from '../siteContext'

/** Card colours / vertical offsets per step, from the design's `steps` array. */
const LOOK = [
  { bg: '#E7F5EA', dot: '#3DDC84', off: '0' },
  { bg: '#FBF1D9', dot: '#F2C766', off: '28px' },
  { bg: '#FBE9E1', dot: '#F4B79A', off: '0' },
  { bg: '#E6EFF9', dot: '#9CC3EE', off: '28px' },
]

export default function Steps() {
  const { site } = useSite()
  const navigate = useNavigate()
  const location = useLocation()
  const goQuote = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') navigate('/')
    setTimeout(() => { const el = document.getElementById('bao-gia'); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' }) }, 60)
  }
  return (
    <H as="section" data-reveal="" s="max-width:1280px;margin:0 auto;padding:110px 28px 0">
      <H data-r="two" s="display:grid;grid-template-columns:.85fr 1.15fr;gap:64px;align-items:start">
        <H data-r="sticky" s="position:sticky;top:110px">
          <H as="span" s="display:inline-flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:#1F7F5C;font-weight:600"><H as="span" s="width:28px;height:2px;background:#3DDC84" />Quy trình</H>
          <H as="h2" data-r="h2" s="font-family:'Playfair Display',serif;font-size:50px;margin:12px 0 18px;letter-spacing:-.03em;font-weight:500;line-height:1.02">Từ ý tưởng đến tay bạn trong 4 bước</H>
          <H as="p" s="margin:0 0 28px;font-size:16px;line-height:1.7;color:#4E5F57;font-weight:300;max-width:38ch">Làm việc thẳng với xưởng nên mỗi bước đều rõ ràng — bạn luôn biết đơn của mình đang ở đâu.</H>
          <H as="a" href="#bao-gia" onClick={goQuote} s="display:inline-flex;align-items:center;gap:10px;padding:15px 26px;border-radius:999px;background:#1F9E63;color:#fff;font-weight:600;font-size:14.5px;transition:all .2s ease;box-shadow:0 14px 28px -14px rgba(31,158,99,.7)" h="background:#0F2D22;color:#fff">Bắt đầu đơn hàng <span>→</span></H>
        </H>
        <H data-r="steps" s="display:grid;grid-template-columns:1fr 1fr;gap:18px">
          {site.steps.map((s, i) => {
            const k = LOOK[i % LOOK.length]
            return (
              <H key={s.n} s={`position:relative;background:${k.bg};border-radius:26px;padding:30px 28px 32px;display:grid;gap:14px;align-content:start;transform:translateY(${k.off});transition:transform .3s ease,box-shadow .3s ease`} h="box-shadow:0 34px 60px -36px rgba(15,45,34,.4)">
                <H as="span" s={`width:54px;height:54px;border-radius:50%;background:${k.dot};color:#0F2D22;display:grid;place-items:center;font-family:'Playfair Display',serif;font-size:22px;font-weight:600`}>{s.n}</H>
                <H as="strong" s="font-size:21px;letter-spacing:-.015em;font-weight:600;margin-top:4px">{s.t}</H>
                <H as="p" s="margin:0;font-size:15px;line-height:1.65;color:#4E5F57;font-weight:300">{s.d}</H>
              </H>
            )
          })}
        </H>
      </H>
    </H>
  )
}
