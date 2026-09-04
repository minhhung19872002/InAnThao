import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Bento from '../components/Bento'
import Catalog from '../components/Catalog'
import Hero from '../components/Hero'
import QuoteForm from '../components/QuoteForm'
import Steps from '../components/Steps'
import Ticker from '../components/Ticker'

/** The `isHome` branch of the v2 design: hero → ribbon → services (bento) → catalogue → steps → quote.
 *  The footer is rendered once by the app shell so it also shows on product detail pages. */
export default function Home() {
  const { hash, state } = useLocation()

  useEffect(() => {
    const target = state?.scrollTo || (hash ? hash.slice(1) : null)
    if (!target) return
    const t = setTimeout(() => {
      const el = document.getElementById(target)
      if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' })
    }, 80)
    return () => clearTimeout(t)
  }, [hash, state])

  return (
    <>
      <Hero />
      <Ticker />
      <Bento />
      <Catalog />
      <Steps />
      <QuoteForm />
    </>
  )
}
