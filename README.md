# In An Thảo – Website xưởng in

Website giới thiệu và báo giá cho **Xưởng In An Thảo** (inanthao.com), dựng theo bản thiết kế Claude Design `In An Thao.dc.html`.

| Layer    | Stack                                           |
| -------- | ----------------------------------------------- |
| Frontend | React 19 (JavaScript) + Vite + React Router     |
| Backend  | ASP.NET Core 9 Minimal API + EF Core 9 (Npgsql) |
| Database | PostgreSQL 16                                   |
| Infra    | Docker Compose (db + api + nginx web)           |

## Chạy bằng Docker (khuyến nghị)

```bash
cp .env.example .env        # sửa port nếu máy đã dùng 5432 / 8080
docker compose up -d --build
```

- Web: http://localhost:8080 (hoặc `WEB_PORT` trong `.env`)
- API: http://localhost:5000/api (OpenAPI: http://localhost:5000/openapi/v1.json)
- Postgres: `localhost:5432`, db `inanthao`, user/pass `postgres/postgres`

API tự chạy migration và seed dữ liệu danh mục/sản phẩm khi khởi động.

## Chạy dev không Docker

```bash
# 1. Postgres (bất kỳ instance nào), rồi chỉnh ConnectionStrings:Default trong backend/InAnThao.Api/appsettings.json
# 2. API
cd backend/InAnThao.Api && dotnet run        # http://localhost:5000
# 3. Web (Vite proxy /api -> localhost:5000)
cd frontend && npm install && npm run dev    # http://localhost:5173
```

## Cấu trúc

```
backend/
  InAnThao.Api/
    Data/         Entities, AppDbContext, DbSeeder, Migrations
    Endpoints/    CatalogEndpoints, QuoteEndpoints, AdminEndpoints (bảo vệ bằng X-Admin-Key)
    Services/     PricingService (hệ số giấy × gia công, giảm 15% từ 500 sp)
    Contracts/    DTOs
frontend/
  src/
    api/client.js        fetch wrapper + định dạng tiền
    components/          TopBar, Header (dropdown nav), Hero, Ticker, Catalog, Steps, Why, QuoteForm, Footer, ProductCard
    pages/               Home, ProductDetail (/san-pham/:slug), Admin (/quan-tri)
    siteContext.jsx      nội dung tĩnh + danh mục dùng chung (có fallback khi API lỗi)
    styles.css           token màu/typography từ design + responsive
docker-compose.yml
```

## API chính

| Method | Route                                             | Mô tả                                   |
| ------ | ------------------------------------------------- | --------------------------------------- |
| GET    | `/api/site`                                       | Thông tin xưởng, stats, ticker, steps…  |
| GET    | `/api/categories`                                 | Danh mục + tuỳ chọn giấy + thông số     |
| GET    | `/api/products?category=thiep-cuoi`               | Danh sách sản phẩm (lọc theo danh mục)  |
| GET    | `/api/products/{slug}`                            | Chi tiết + gallery + mẫu tương tự       |
| GET    | `/api/estimate?category=&product=&qty=&paperId=&finishId=` | Ước tính giá                   |
| POST   | `/api/quotes`                                     | Gửi yêu cầu báo giá                     |
| GET    | `/api/admin/stats`                                | Thống kê yêu cầu (cần `X-Admin-Key`)    |
| GET    | `/api/admin/quotes?status=&search=&page=&pageSize=` | Danh sách yêu cầu, lọc + phân trang   |
| PATCH  | `/api/admin/quotes/{id}/status`                   | Đổi trạng thái: new/contacted/quoted/done/cancelled |
| DELETE | `/api/admin/quotes/{id}`                          | Xoá yêu cầu                             |

## Trang quản trị

- Đường dẫn: `/quan-tri` (không có link công khai trên site).
- Đăng nhập bằng mật khẩu cấu hình ở `Admin:Password` (`appsettings.json`) hoặc biến môi trường `ADMIN_PASSWORD` trong `.env` khi chạy Docker. Mặc định `admin123` – **đổi trước khi đưa lên production**.
- Chức năng: thống kê theo trạng thái, lọc, tìm kiếm (tên/SĐT/sản phẩm/ghi chú), xem chi tiết (giấy, gia công, ghi chú, mở Zalo), đổi trạng thái, xoá.

## Deploy production (VM dùng chung Caddy)

Máy chủ đã có `proxy-caddy` giữ cổng 80/443, mỗi app một file trong `~/proxy/sites/`.

```bash
# lần đầu
git clone https://github.com/minhhung19872002/InAnThao.git ~/apps/inanthao && cd ~/apps/inanthao
cp .env.example .env    # đặt POSTGRES_PASSWORD, ADMIN_PASSWORD mạnh; DOMAIN=inanthao.bluestar.com.vn
./deploy/deploy.sh --no-pull
cp deploy/caddy/inanthao.caddy ~/proxy/sites/
docker network connect inanthao_inanthao proxy-caddy   # + khai báo network trong ~/proxy/docker-compose.yml
docker exec proxy-caddy caddy reload --config /etc/caddy/Caddyfile

# cập nhật
cd ~/apps/inanthao && ./deploy/deploy.sh
```

`docker-compose.prod.yml` tắt mọi cổng publish; Caddy vào network `inanthao_inanthao` và trỏ tới `inanthao-web:80`.
DNS: bản ghi A `inanthao.bluestar.com.vn` → IP máy chủ, Caddy tự xin chứng chỉ Let's Encrypt.

## CI/CD

`.github/workflows/deploy.yml`: mỗi push lên `main` → job **build** (dotnet build + npm build) → job **deploy** SSH vào VM chạy `deploy/deploy.sh` → smoke test qua Caddy.
Secrets cần có trên GitHub: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` (khoá ed25519 riêng cho deploy, public key nằm trong `~/.ssh/authorized_keys` của VM), tuỳ chọn `SSH_PORT`.
Pull request chỉ chạy job build. Có thể chạy tay bằng "Run workflow".
