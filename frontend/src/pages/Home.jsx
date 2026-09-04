import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Catalog from '../components/Catalog'
import Hero from '../components/Hero'
import QuoteForm from '../components/QuoteForm'
import Steps from '../components/Steps'
import Ticker from '../components/Ticker'
import Why from '../components/Why'

export default function Home() {
  const { hash, state } = useLocation()

  // Support deep links like /#bao-gia and /?cat=thiep-cuoi#danh-muc, plus scroll target from product page.
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
    </>
  )
}
