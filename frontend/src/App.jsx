import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import TopBar from './components/TopBar'
import { useDesignEffects } from './hooks/useDesignEffects'
import Admin from './pages/Admin'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { SiteProvider } from './siteContext'

// Mirrors the design's root: <div data-grain> spot → topbar → header → (home | detail).
// The design keeps the footer inside its `isHome` branch; here it is shared by every
// public page so product detail pages end with it too.
function Shell() {
  useDesignEffects()
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/quan-tri')
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }} data-grain="">
      <div data-r="spot" />
      <TopBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/san-pham/:slug" element={<ProductDetail />} />
        <Route path="/quan-tri" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Shell />
      </SiteProvider>
    </BrowserRouter>
  )
}
