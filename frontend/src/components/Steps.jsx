import { useSite } from '../siteContext'

export default function Steps() {
  const { site } = useSite()
  return (
    <section className="section section--steps">
      <span className="eyebrow">Quy trình</span>
      <h2 className="h2">Bốn bước, từ ý tưởng đến tận tay</h2>
      <div className="steps">
        {site.steps.map((s) => (
          <div className="step" key={s.n}>
            <div className="step__top">
              <span className="step__n">{s.n}</span>
              <span className="step__conn" />
            </div>
            <strong className="step__t">{s.t}</strong>
            <p className="step__d">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
