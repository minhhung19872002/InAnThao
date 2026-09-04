import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Catalog from '../components/Catalog'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import QuoteForm from '../components/QuoteForm'
import Steps from '../components/Steps'
import Ticker from '../components/Ticker'
import Why from '../components/Why'

/** The `isHome` branch of the design: hero → ticker → catalogue → steps → why → quote → footer. */
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
      <Catalog />
      <Steps />
      <Why />
      <QuoteForm />
      <Footer />
    </>
  )
}
