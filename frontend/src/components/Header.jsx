import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import H from '../ui/H'
import { useSite } from '../siteContext'

const scrollToId = (id, offset = 60) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' })
}

/** Header ported 1:1 from the v2 design (pill nav, dropdowns, mobile toggle). */
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
    <H as="header" s="position:sticky;top:0;z-index:40;background:rgba(251,248,242,.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(15,45,34,.08)">
      <H s="max-width:1280px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;gap:28px">
        <H as="a" href="#top" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0 }) }} s="display:flex;align-items:center;gap:12px;color:#0F2D22">
          <H as="img" src={site.logoUrl} alt="Logo An Thảo" s="height:42px;width:auto;display:block" />
          <H as="span" data-r="brandtext" s="display:grid;line-height:1.1">
            <H as="strong" s="font-family:'Playfair Display',serif;font-size:19px;letter-spacing:-.01em">An Thảo</H>
            <H as="span" s="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#6B7F75">{site.tagline}</H>
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
                  s={`position:relative;background:${open ? 'rgba(15,45,34,.08)' : 'transparent'};color:#0F2D22;border:0;padding:10px 14px;border-radius:999px;font-size:14px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;transition:background .2s ease,color .2s ease`}
                  h="background:rgba(15,45,34,.06)"
                >
                  {n.label}
                  <H as="span" s={`font-size:9px;display:inline-block;transition:transform .28s cubic-bezier(.2,.8,.2,1);transform:${open ? 'rotate(180deg)' : 'none'};color:${open ? '#1F7F5C' : '#6B7F75'}`}>{n.kids.length ? '▾' : ''}</H>
                </H>
                {open && (
                  <H s="position:absolute;top:calc(100% + 12px);left:0;min-width:300px;z-index:5;animation:ddIn .22s cubic-bezier(.2,.8,.2,1) both;transform-origin:top left">
                    <H s="background:#fff;color:#0F2D22;border-radius:18px;padding:10px;box-shadow:0 34px 70px -28px rgba(15,45,34,.35);border:1px solid rgba(15,45,34,.08)">
                      <H s="padding:8px 12px 10px;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#6B7F75;border-bottom:1px solid rgba(15,45,34,.08);margin-bottom:6px">{n.label}</H>
                      {n.kids.map((k, j) => (
                        <H
                          key={k}
                          as="a"
                          href="#danh-muc"
                          onClick={(e) => { e.preventDefault(); pickCat(n.slug) }}
                          s={`display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;font-size:14px;color:#0F2D22;animation:ddItem .3s cubic-bezier(.2,.8,.2,1) both;animation-delay:${j * 45}ms;transition:background .18s ease,padding-left .18s ease`}
                          h="background:#E7F5EA;color:#1F7F5C;padding-left:16px"
                        >
                          <H as="span" s="width:6px;height:6px;border-radius:50%;background:#3DDC84" />{k}
                        </H>
                      ))}
                    </H>
                  </H>
                )}
              </H>
            )
          })}
          <H as="a" href="#bao-gia" onClick={goQuote} s="margin-left:12px;padding:12px 22px;border-radius:999px;background:#1F9E63;color:#fff;font-size:14px;font-weight:600;transition:all .2s ease;box-shadow:0 12px 24px -12px rgba(31,158,99,.7)" h="background:#0F2D22;color:#fff">Nhận báo giá</H>
        </H>

        <H as="button" type="button" data-r="navtoggle" onClick={() => setMobileNav((v) => !v)} s="margin-left:auto;align-items:center;gap:9px;background:#1F9E63;color:#fff;border:0;border-radius:999px;padding:11px 16px;font-size:14px;font-weight:600;cursor:pointer">Menu</H>
      </H>

      {mobileNav && (
        <H s="border-top:1px solid rgba(15,45,34,.08);background:#F4EFE4;padding:12px 18px 18px;display:grid;gap:2px;animation:ddIn .2s ease both">
          {NAV.map((m) => (
            <H key={m.label} as="button" type="button" onClick={() => pickCat(m.slug)} s="text-align:left;background:none;border:0;cursor:pointer;padding:13px 10px;border-radius:12px;font-size:16px;font-weight:500;border-bottom:1px solid rgba(15,45,34,.06)" h="background:rgba(15,45,34,.05)">{m.label}</H>
          ))}
          <H as="a" href="#bao-gia" onClick={goQuote} s="margin-top:10px;text-align:center;padding:14px;border-radius:999px;background:#0F2D22;color:#F4EFE4;font-weight:600">Nhận báo giá</H>
        </H>
      )}
    </H>
  )
}
