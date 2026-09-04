import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSite } from '../siteContext'

const ABOUT_LABEL = 'Về xưởng'

function scrollToId(id, offset = 60) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' })
}

/** Sticky header with hover/click dropdown menus (desktop) and a collapsible list (mobile). */
export default function Header() {
  const { site, categories } = useSite()
  const navigate = useNavigate()
  const location = useLocation()
  const [openNav, setOpenNav] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const leaveTimer = useRef(null)

  const navItems = [...categories.map((c) => ({ label: c.name, slug: c.slug, kids: c.subLabels || [] })), { label: ABOUT_LABEL, slug: null, kids: [] }]

  useEffect(() => {
    setMobileOpen(false)
    setOpenNav(null)
  }, [location.pathname])

  const goCategory = (slug) => {
    setOpenNav(null)
    setMobileOpen(false)
    navigate(slug ? `/?cat=${slug}` : '/')
    setTimeout(() => scrollToId(slug ? 'danh-muc' : 'top', slug ? 60 : 0), 60)
  }
  const goQuote = (e) => {
    e?.preventDefault()
    setMobileOpen(false)
    if (location.pathname !== '/') navigate('/')
    setTimeout(() => scrollToId('bao-gia'), 80)
  }

  const enter = (i, hasKids) => {
    clearTimeout(leaveTimer.current)
    if (hasKids) setOpenNav(i)
  }
  const leave = (i) => {
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setOpenNav((cur) => (cur === i ? null : cur)), 140)
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand" aria-label="Về trang chủ" onClick={() => window.scrollTo({ top: 0 })}>
          <img src={site.logoUrl} alt="Logo Xưởng In An Thảo" className="brand__logo" />
          <span className="brand__text">
            <strong className="brand__name">{site.name}</strong>
            <span className="brand__sub">{site.tagline}</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Danh mục">
          {navItems.map((n, i) => {
            const hasKids = n.kids.length > 0
            const open = openNav === i && hasKids
            return (
              <div key={n.label} className="nav__item" onMouseEnter={() => enter(i, hasKids)} onMouseLeave={() => leave(i)}>
                <button
                  type="button"
                  className={`nav__btn${open ? ' is-open' : ''}`}
                  aria-expanded={hasKids ? open : undefined}
                  onClick={() => (hasKids ? setOpenNav(open ? null : i) : goCategory(n.slug))}
                >
                  {n.label}
                  {hasKids && <span className="nav__caret">▾</span>}
                  <span className="nav__line" />
                </button>
                {open && (
                  <div className="dropdown">
                    <span className="dropdown__arrow" />
                    <div className="dropdown__panel">
                      <div className="dropdown__title">{n.label}</div>
                      {n.kids.map((k, j) => (
                        <button
                          type="button"
                          key={k}
                          className="dropdown__link"
                          style={{ animationDelay: `${j * 45}ms` }}
                          onClick={() => goCategory(n.slug)}
                        >
                          <span>
                            <span className="dropdown__bullet" />
                            {k}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <a href="#bao-gia" className="btn-pill nav__cta" onClick={goQuote}>Nhận báo giá</a>
        </nav>

        <button type="button" className="navtoggle" aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
          <span className="navtoggle__bars"><span /><span /><span /></span>
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="mobilenav">
          {navItems.map((n) => (
            <button type="button" key={n.label} className="mobilenav__link" onClick={() => goCategory(n.slug)}>
              {n.label}
            </button>
          ))}
          <a href="#bao-gia" className="btn-pill mobilenav__cta" onClick={goQuote}>Nhận báo giá</a>
        </div>
      )}
    </header>
  )
}
