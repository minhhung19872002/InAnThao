import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import TopBar from './components/TopBar'
import Admin from './pages/Admin'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { SiteProvider } from './siteContext'

// Mirrors the design's root: <div style="min-height:100vh"> topbar → header → (home | detail)
export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <div style={{ minHeight: '100vh' }}>
          <TopBar />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/san-pham/:slug" element={<ProductDetail />} />
            <Route path="/quan-tri" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </SiteProvider>
    </BrowserRouter>
  )
}
