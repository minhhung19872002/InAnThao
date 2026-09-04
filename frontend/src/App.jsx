import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { SiteProvider } from './siteContext'

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <div className="page">
          <TopBar />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/san-pham/:slug" element={<ProductDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </SiteProvider>
    </BrowserRouter>
  )
}
