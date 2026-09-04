import H from '../ui/H'
import { useSite } from '../siteContext'

export default function Ticker() {
  const { site } = useSite()
  const ticker = [...site.ticker, ...site.ticker].map((t) => t + ' ·')
  return (
    <H s="overflow:hidden;margin-top:72px;background:linear-gradient(135deg,#5A626B 0%,#3F4750 45%,#2E353C 100%);color:#FCFAED">
      <H s="display:flex;width:max-content;animation:marq 34s linear infinite">
        {ticker.map((t, i) => (
          <H key={i} as="span" s="padding:15px 26px;font-size:12.5px;letter-spacing:.18em;text-transform:uppercase;color:#C9CFC7;white-space:nowrap;display:inline-flex;align-items:center;gap:26px">{t}<H as="span" s="width:5px;height:5px;border-radius:50%;background:#F7B746;display:inline-block" /></H>
        ))}
      </H>
    </H>
  )
}
