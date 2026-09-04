import H from '../ui/H'
import { SITE_FALLBACK, useSite } from '../siteContext'

/** The rotated gold ribbon + dark reverse marquee under the hero. */
export default function Ticker() {
  const { site } = useSite()
  const ticker = [...site.ticker, ...site.ticker]
  const t2 = site.ticker2 || SITE_FALLBACK.ticker2
  const ticker2 = [...t2, ...t2]
  return (
    <H s="position:relative;z-index:2;padding:0 0 24px;overflow-x:clip">
      <H data-r="ribbon" s="position:relative;transform:rotate(-1.4deg) scale(1.03);margin:-26px 0 0">
        <H s="position:absolute;inset:0;transform:rotate(2.6deg) translateY(8px);background:#0F2D22;border-radius:2px" />
        <H s="position:relative;overflow:hidden;background:linear-gradient(90deg,#F2C766 0%,#F8D98A 50%,#F2C766 100%);box-shadow:0 20px 40px -20px rgba(15,45,34,.4)">
          <H s="position:absolute;top:0;bottom:0;width:22%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:shimmer 4.5s ease-in-out infinite;pointer-events:none" />
          <H s="display:flex;width:max-content;animation:marq 34s linear infinite">
            {ticker.map((t, i) => (
              <H key={i} as="span" s="padding:15px 26px;font-size:12.5px;letter-spacing:.22em;text-transform:uppercase;color:#0F2D22;font-weight:700;white-space:nowrap;display:inline-flex;align-items:center;gap:26px">
                {t}<H as="span" s="width:22px;height:22px;border-radius:50%;background:#0F2D22;color:#F2C766;display:grid;place-items:center;font-size:11px;font-weight:700">✓</H>
              </H>
            ))}
          </H>
        </H>
        <H s="position:relative;overflow:hidden;background:#0F2D22;margin-top:-2px">
          <H s="display:flex;width:max-content;animation:marqR 46s linear infinite">
            {ticker2.map((t, i) => (
              <H key={i} as="span" s="padding:10px 26px;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#7FA08F;font-weight:500;white-space:nowrap;display:inline-flex;align-items:center;gap:26px">
                {t}<H as="span" s="width:4px;height:4px;border-radius:50%;background:#3DDC84;display:inline-block" />
              </H>
            ))}
          </H>
        </H>
      </H>
    </H>
  )
}
