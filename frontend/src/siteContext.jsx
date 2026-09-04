import { createContext, useContext } from 'react'
import { api } from './api/client'
import { useApi } from './hooks/useApi'

/** Static copy mirrored from the design; used until /api/site responds (or if the API is down). */
export const SITE_FALLBACK = {
  name: 'Xưởng In An Thảo',
  tagline: 'In ấn · TP. Hồ Chí Minh',
  phone: '0932 733 764',
  email: 'hien.anthao@gmail.com',
  hours: '8:00 – 18:00, Thứ 2 – Thứ 7',
  logoUrl: 'https://www.inanthao.com//admin/webroot/upload/image/files/logo_anthao_large.png',
  stats: [
    { n: '7 năm', l: 'kinh nghiệm xưởng in' },
    { n: '2.400+', l: 'đơn hàng đã giao' },
    { n: '48h', l: 'in nhanh khi cần' },
  ],
  ticker: ['In offset', 'Ép kim · Ép nhũ', 'Cấn bế theo hình', 'Giấy mỹ thuật', 'Cán bóng / mờ', 'Thiết kế miễn phí', 'Giao toàn quốc', 'Xuất hoá đơn VAT'],
  steps: [
    { n: '01', t: 'Chọn mẫu', d: 'Xem mẫu sẵn hoặc gửi ý tưởng của bạn cho xưởng.' },
    { n: '02', t: 'Thiết kế miễn phí', d: 'Dàn trang nội dung, gửi bản xem trước để bạn duyệt.' },
    { n: '03', t: 'In & gia công', d: 'In offset, ép kim, cấn bế theo đúng bản đã duyệt.' },
    { n: '04', t: 'Giao hàng', d: 'Đóng gói cẩn thận, giao tận nơi toàn quốc.' },
  ],
  why: [
    { n: '01', t: 'Giá gốc tại xưởng', d: 'Không qua trung gian, báo giá minh bạch theo số lượng và chất liệu.' },
    { n: '02', t: 'Sửa file không giới hạn', d: 'Đội thiết kế nội bộ chỉnh đến khi bạn duyệt, không tính phí.' },
    { n: '03', t: 'In thử trước khi in thật', d: 'Bạn cầm bản mẫu thật trên tay rồi mới chốt số lượng.' },
    { n: '04', t: 'Đúng hẹn, giao tận nơi', d: 'Theo dõi tiến độ qua Zalo; giao COD toàn quốc.' },
  ],
  perks: ['Thiết kế và dàn trang miễn phí', 'Xem mẫu in thật trước khi in số lượng', 'Giảm 15% cho đơn từ 500 sản phẩm'],
}

export const CATEGORIES_FALLBACK = [
  { id: 1, name: 'Thiệp cưới', slug: 'thiep-cuoi', basePrice: 4500, subLabels: ['Thiệp cưới 2025', 'Thiệp cưới cao cấp', 'Thiệp cưới giá rẻ'], paperOptions: [], specs: [] },
  { id: 2, name: 'Tem nhãn', slug: 'tem-nhan', basePrice: 250, subLabels: ['Decal giấy', 'Decal nhựa trong', 'Tem bảo hành'], paperOptions: [], specs: [] },
  { id: 3, name: 'Bao bì', slug: 'bao-bi', basePrice: 9000, subLabels: ['Hộp giấy cứng', 'Túi giấy', 'Hộp bánh – trà'], paperOptions: [], specs: [] },
  { id: 4, name: 'Ấn phẩm', slug: 'an-pham', basePrice: 18000, subLabels: ['Catalogue', 'Tờ rơi – Brochure', 'Standee – Backdrop'], paperOptions: [], specs: [] },
]

const SiteContext = createContext({ site: SITE_FALLBACK, categories: CATEGORIES_FALLBACK, apiDown: false })

export function SiteProvider({ children }) {
  const site = useApi(() => api.site(), [], { fallback: SITE_FALLBACK })
  const cats = useApi(() => api.categories(), [], { fallback: CATEGORIES_FALLBACK })
  const value = {
    site: site.data || SITE_FALLBACK,
    categories: cats.data || CATEGORIES_FALLBACK,
    apiDown: Boolean(site.error || cats.error),
  }
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
