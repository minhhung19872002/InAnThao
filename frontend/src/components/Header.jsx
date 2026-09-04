import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import H from '../ui/H'
import { useSite } from '../siteContext'

const scrollToId = (id, offset = 60) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' })
}

/** Header ported 1:1 from the design (nav dropdowns, mobile toggle). */
export default function Header() {
  const { site, categories } = useSite()
  const navigate = useNavigate()
  const location = useLocation()
  const [openNav, setOpenNav] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const navT = useRef(null)

  const NAV = [...categories.map((c) => ({ label: c.name, slug: c.slug, kids: c.subLabels || [] })), { label: 'Về xưởng', slug: null, kids: [] }]

  useEffect(() => {
    setMobileNav(false)
    setOpenNav(null)
  }, [location.pathname])

  // k.pick / m.pick in the design: set category and scroll to #danh-muc
  const pickCat = (slug) => {
    setOpenNav(null)
    setMobileNav(false)
    navigate(slug ? `/?cat=${slug}` : '/')
    setTimeout(() => (slug ? scrollToId('danh-muc', 60) : window.scrollTo({ top: 0 })), 60)
  }
  const goQuote = (e) => {
    e.preventDefault()
    setMobileNav(false)
    if (location.pathname !== '/') navigate('/')
    setTimeout(() => scrollToId('bao-gia', 60), 80)
  }

  return (
    <H as="header" s="position:sticky;top:0;z-index:40;background:rgba(252,250,237,.92);backdrop-filter:blur(14px);border-bottom:1px solid #E8E4D6">
      <H s="max-width:1240px;margin:0 auto;padding:13px 24px;display:flex;align-items:center;gap:28px">
        <H as="a" href="#top" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0 }) }} s="display:flex;align-items:center;gap:12px;color:#3F4750">
          <H as="img" src={site.logoUrl} alt="Logo Xưởng In An Thảo" s="height:44px;width:auto;display:block" />
          <H as="span" s="display:grid;line-height:1.15">
            <H as="strong" s="font-family:'Playfair Display',serif;font-size:19px">{site.name}</H>
            <H as="span" s="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8C8A7E">{site.tagline}</H>
          </H>
        </H>

        <H as="nav" data-r="navdesk" s="margin-left:auto;display:flex;gap:2px;align-items:center">
          {NAV.map((n, i) => {
            const open = openNav === i && n.kids.length > 0
            const enter = () => { clearTimeout(navT.current); if (n.kids.length) setOpenNav(i) }
            const leave = () => { clearTimeout(navT.current); navT.current = setTimeout(() => setOpenNav((s) => (s === i ? null : s)), 140) }
            const toggle = () => (n.kids.length ? setOpenNav((s) => (s === i ? null : i)) : pickCat(n.slug))
            return (
              <H key={n.label} s="position:relative" onMouseEnter={enter} onMouseLeave={leave}>
                <H
                  as="button"
                  type="button"
                  onClick={toggle}
                  s={`position:relative;background:${open ? '#ECF3EA' : 'transparent'};color:${open ? '#1F7F5C' : '#3F4750'};border:0;padding:10px 13px;border-radius:10px;font-size:14.5px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;transition:background .2s ease,color .2s ease`}
                  h="background:#ECF3EA"
                >
                  {n.label}
                  <H as="span" s={`font-size:9px;display:inline-block;transition:transform .28s cubic-bezier(.2,.8,.2,1);transform:${open ? 'rotate(180deg)' : 'none'};color:${open ? '#00A651' : '#8C8A7E'}`}>{n.kids.length ? '▾' : ''}</H>
                  <H as="span" s={`position:absolute;left:13px;right:13px;bottom:4px;height:2px;border-radius:2px;background:#00A651;transform-origin:left;transform:${open ? 'scaleX(1)' : 'scaleX(0)'};transition:transform .28s cubic-bezier(.2,.8,.2,1)`} />
                </H>
                {open && (
                  <H s="position:absolute;top:calc(100% + 10px);left:0;min-width:300px;padding-top:0;z-index:5;animation:ddIn .22s cubic-bezier(.2,.8,.2,1) both;transform-origin:top left">
                    <H as="span" s="position:absolute;top:-6px;left:26px;width:12px;height:12px;background:#fff;border-left:1px solid #E8E4D6;border-top:1px solid #E8E4D6;transform:rotate(45deg);border-radius:2px" />
                    <H s="background:#fff;border:1px solid #E8E4D6;border-radius:16px;padding:10px;box-shadow:0 30px 60px -24px rgba(63,71,80,.32),0 2px 8px -2px rgba(63,71,80,.08);overflow:hidden">
                      <H s="padding:6px 12px 10px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8C8A7E;border-bottom:1px solid #F1EEE2;margin-bottom:6px">{n.label}</H>
                      {n.kids.map((k, j) => (
                        <H
                          key={k}
                          as="a"
                          href="#danh-muc"
                          onClick={(e) => { e.preventDefault(); pickCat(n.slug) }}
                          s={`display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:10px;font-size:14px;color:#383E44;animation:ddItem .3s cubic-bezier(.2,.8,.2,1) both;animation-delay:${j * 45}ms;transition:background .18s ease,color .18s ease,padding-left .18s ease`}
                          h="background:#F2FAF6;color:#00A651;padding-left:16px"
                        >
                          <H as="span" s="display:flex;align-items:center;gap:10px">
                            <H as="span" s="width:6px;height:6px;border-radius:50%;background:#00A651;opacity:.55" />
                            {k}
                          </H>
                        </H>
                      ))}
                    </H>
                  </H>
                )}
              </H>
            )
          })}
          <H as="a" href="#bao-gia" onClick={goQuote} s="margin-left:10px;padding:11px 20px;border-radius:999px;background:#00A651;color:#fff;font-size:14.5px;font-weight:600" h="background:#1F7F5C;color:#fff">Nhận báo giá</H>
        </H>

        <H as="button" type="button" data-r="navtoggle" onClick={() => setMobileNav((v) => !v)} s="margin-left:auto;align-items:center;gap:9px;background:none;border:1px solid #DFDACA;border-radius:12px;padding:10px 15px;font-size:14px;font-weight:600;cursor:pointer">
          <H as="span" s="display:grid;gap:3.5px">
            <H as="span" s="width:16px;height:2px;background:#3F4750;display:block" />
            <H as="span" s="width:16px;height:2px;background:#3F4750;display:block" />
            <H as="span" s="width:16px;height:2px;background:#3F4750;display:block" />
          </H>
          Menu
        </H>
      </H>

      {mobileNav && (
        <H s="border-top:1px solid #E8E4D6;background:#fff;padding:12px 18px 18px;display:grid;gap:4px;animation:floatUp .2s ease both">
          {NAV.map((m) => (
            <H key={m.label} as="button" type="button" onClick={() => pickCat(m.slug)} s="text-align:left;background:none;border:0;cursor:pointer;padding:12px 10px;border-radius:10px;font-size:15.5px;font-weight:500;border-bottom:1px solid #F3F0E5" h="background:#F2FAF6;color:#00A651">{m.label}</H>
          ))}
          <H as="a" href="#bao-gia" onClick={goQuote} s="margin-top:10px;text-align:center;padding:14px;border-radius:999px;background:#00A651;color:#fff;font-weight:600;font-size:15px" h="background:#1F7F5C;color:#fff">Nhận báo giá</H>
        </H>
      )}
    </H>
  )
}
