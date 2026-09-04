import { useSite } from '../siteContext'

const HERO_IMG = 'https://www.inanthao.com//admin/webroot/upload/image/images/thiep_cuoi_ATD/ATK07_KEa_thiep_cuoi_vintage_0932733764.jpg'

export default function Hero() {
  const { site } = useSite()
  return (
    <div className="hero-wrap">
      <div className="hero-dots" />
      <div className="hero-glow" />
      <section id="top" className="hero">
        <div className="hero__copy">
          <span className="eyebrow-pill">
            <span className="check-dot">✓</span>Xưởng in trực tiếp · TP. HCM
          </span>
          <h1 className="h1">
            In ấn tinh tế cho <em>những dịp<span className="hl" /></em> quan trọng
          </h1>
          <p className="hero__lead">
            Xưởng in trực tiếp, không qua trung gian. Chọn mẫu, gửi nội dung — chúng tôi lo phần còn lại: thiết kế miễn phí, in đúng hẹn, giao tận nơi.
          </p>
          <div className="hero__ctas">
            <a href="#danh-muc" className="btn-pill cta-primary">Xem mẫu thiệp <span className="arrow">→</span></a>
            <a href="#bao-gia" className="cta-ghost">Báo giá trong 15 phút</a>
          </div>
          <div className="stats">
            {site.stats.map((s) => (
              <div className="stat" key={s.l}>
                <div className="stat__n">{s.n}</div>
                <div className="stat__l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__frame" />
          <div className="hero__coin" />
          <div className="media">
            <img
              src={HERO_IMG}
              alt="Thiệp cưới vintage in tại xưởng An Thảo"
              loading="eager"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/hero.png' }}
            />
          </div>
          <div className="hero__price">
            <small>Thiệp cưới từ</small>
            <strong>1.000₫<span> /thiệp</span></strong>
          </div>
          <div className="hero__badge"><i />Thiết kế miễn phí</div>
        </div>
      </section>
    </div>
  )
}
