import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Port of the design's `componentDidMount` / `componentDidUpdate`:
 * cursor spotlight, card 3D tilt + glare, magnetic buttons (fine pointer only)
 * and reveal-on-scroll for every `[data-reveal]` element.
 */
export function useDesignEffects() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = document
    const fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches

    const onMove = (e) => {
      if (!fine) return
      root.documentElement.style.setProperty('--sx', e.clientX + 'px')
      root.documentElement.style.setProperty('--sy', e.clientY + 'px')
      const card = e.target.closest && e.target.closest('[data-r="card"]')
      if (card) {
        const r = card.getBoundingClientRect()
        const x = e.clientX - r.left, y = e.clientY - r.top
        card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px')
        const rx = ((y / r.height) - .5) * -6, ry = ((x / r.width) - .5) * 6
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)'
      }
      const mag = e.target.closest && e.target.closest('[data-r~="mag"]')
      if (mag) {
        const r = mag.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) * .18, dy = (e.clientY - (r.top + r.height / 2)) * .28
        mag.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'
      }
    }
    const onOut = (e) => {
      const card = e.target.closest && e.target.closest('[data-r="card"]')
      if (card && !card.contains(e.relatedTarget)) card.style.transform = ''
      const mag = e.target.closest && e.target.closest('[data-r~="mag"]')
      if (mag && !mag.contains(e.relatedTarget)) mag.style.transform = ''
    }
    root.addEventListener('mousemove', onMove, { passive: true })
    root.addEventListener('mouseout', onOut, { passive: true })

    // reveal on scroll
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
    }), { threshold: .12 })
    const observe = () => root.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 1.1) el.classList.add('in'); else io.observe(el)
    })
    observe()
    // componentDidUpdate equivalent: re-observe whenever React mounts new nodes
    let raf = 0
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(observe) })
    mo.observe(root.body, { childList: true, subtree: true })
    const safety = setTimeout(() => root.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in')
    }), 1500)

    return () => {
      root.removeEventListener('mousemove', onMove); root.removeEventListener('mouseout', onOut)
      io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); clearTimeout(safety)
    }
  }, [])

  // route change = the design's setState({box}) re-render: reveal anything already in view
  useEffect(() => {
    const t = setTimeout(() => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add('in')
    }), 50)
    return () => clearTimeout(t)
  }, [location.pathname, location.search])
}
