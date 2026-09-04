import { useSite } from '../siteContext'

export default function Why() {
  const { site } = useSite()
  return (
    <section className="section section--why">
      <div className="two">
        <div className="sticky">
          <span className="eyebrow">Vì sao chọn An Thảo</span>
          <h2 className="h2" style={{ marginBottom: 18 }}>Làm việc thẳng với xưởng, mọi thứ rõ ràng hơn</h2>
          <p className="why-lead">Không qua đại lý nên giá tốt hơn, sửa file nhanh hơn và bạn luôn biết đơn của mình đang ở bước nào.</p>
        </div>
        <div className="why">
          {site.why.map((w) => (
            <div className="why__card" key={w.n}>
              <span className="why__i">{w.n}</span>
              <strong className="why__t">{w.t}</strong>
              <p className="why__d">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
