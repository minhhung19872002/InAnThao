using InAnThao.Api.Contracts;
using InAnThao.Api.Data;
using InAnThao.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Endpoints;

public static class CatalogEndpoints
{
    public static IEndpointRouteBuilder MapCatalog(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/api").WithTags("Catalog");

        g.MapGet("/site", () => SiteContent.Info);

        g.MapGet("/categories", async (AppDbContext db, CancellationToken ct) =>
            await db.Categories.AsNoTracking()
                .Include(c => c.PaperOptions).Include(c => c.Specs)
                .OrderBy(c => c.SortOrder)
                .Select(c => ToDto(c))
                .ToListAsync(ct));

        g.MapGet("/finishes", async (AppDbContext db, CancellationToken ct) =>
            await db.FinishOptions.AsNoTracking().OrderBy(f => f.SortOrder)
                .Select(f => new OptionDto(f.Id, f.Label, f.Multiplier)).ToListAsync(ct));

        g.MapGet("/products", async (string? category, AppDbContext db, CancellationToken ct) =>
        {
            var q = db.Products.AsNoTracking().Include(p => p.Category).Where(p => p.IsActive);
            if (!string.IsNullOrWhiteSpace(category))
                q = q.Where(p => p.Category!.Slug == category || p.Category.Name == category);
            return await q.OrderBy(p => p.SortOrder).Select(p => ToDto(p)).ToListAsync(ct);
        });

        g.MapGet("/products/{slug}", async (string slug, AppDbContext db, CancellationToken ct) =>
        {
            var p = await db.Products.AsNoTracking().Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive, ct);
            if (p is null) return Results.NotFound();

            var cat = await db.Categories.AsNoTracking()
                .Include(c => c.PaperOptions).Include(c => c.Specs)
                .FirstAsync(c => c.Id == p.CategoryId, ct);
            var finishes = await db.FinishOptions.AsNoTracking().OrderBy(f => f.SortOrder)
                .Select(f => new OptionDto(f.Id, f.Label, f.Multiplier)).ToListAsync(ct);

            // Same ordering as the design: same-category products first, then the rest.
            var others = await db.Products.AsNoTracking().Include(x => x.Category)
                .Where(x => x.IsActive && x.Id != p.Id)
                .OrderBy(x => x.CategoryId == p.CategoryId ? 0 : 1).ThenBy(x => x.SortOrder)
                .ToListAsync(ct);

            var gallery = new[] { p.ImageUrl }.Concat(others.Take(3).Select(x => x.ImageUrl)).ToList();
            var related = others.Take(4).Select(ToDto).ToList();

            return Results.Ok(new ProductDetailDto(
                ToDto(p),
                cat.PaperOptions.OrderBy(o => o.SortOrder).Select(o => new OptionDto(o.Id, o.Label, o.Multiplier)).ToList(),
                finishes,
                cat.Specs.OrderBy(s => s.SortOrder).Select(s => new SpecDto(s.Key, s.Value)).ToList(),
                gallery,
                related));
        });

        g.MapGet("/estimate", async (string? category, string? product, int qty, int? paperId, int? finishId,
            AppDbContext db, CancellationToken ct) =>
        {
            decimal basePrice = 0;
            Category? cat = null;
            if (!string.IsNullOrWhiteSpace(product))
            {
                var p = await db.Products.AsNoTracking().Include(x => x.Category).ThenInclude(c => c!.PaperOptions)
                    .FirstOrDefaultAsync(x => x.Slug == product, ct);
                if (p is null) return Results.NotFound();
                basePrice = p.BasePrice; cat = p.Category;
            }
            else if (!string.IsNullOrWhiteSpace(category))
            {
                cat = await db.Categories.AsNoTracking().Include(c => c.PaperOptions)
                    .FirstOrDefaultAsync(c => c.Slug == category || c.Name == category, ct);
                if (cat is null) return Results.NotFound();
                basePrice = cat.BasePrice;
            }
            else return Results.BadRequest("category or product is required");

            var pm = cat?.PaperOptions.FirstOrDefault(o => o.Id == paperId)?.Multiplier ?? 1;
            var fm = finishId is null ? 1 : (await db.FinishOptions.FindAsync([finishId], ct))?.Multiplier ?? 1;
            return Results.Ok(PricingService.Estimate(basePrice, Math.Max(0, qty), pm, fm));
        });

        return app;
    }

    private static CategoryDto ToDto(Category c) => new(
        c.Id, c.Name, c.Slug, c.BasePrice, c.SubLabels,
        c.PaperOptions.OrderBy(o => o.SortOrder).Select(o => new OptionDto(o.Id, o.Label, o.Multiplier)).ToList(),
        c.Specs.OrderBy(s => s.SortOrder).Select(s => new SpecDto(s.Key, s.Value)).ToList());

    private static ProductDto ToDto(Product p) => new(
        p.Id, p.Name, p.Slug, p.Category?.Name ?? "", p.Category?.Slug ?? "",
        p.PriceLabel, p.BasePrice, p.ImageUrl, p.Description);
}

/// <summary>Static marketing copy from the design (hero stats, ticker, steps, perks).</summary>
public static class SiteContent
{
    public static readonly SiteInfoDto Info = new(
        Name: "Xưởng In An Thảo",
        Tagline: "Printing Studio",
        Phone: "0932 733 764",
        Email: "hien.anthao@gmail.com",
        Hours: "8:00 – 18:00, Thứ 2 – Thứ 7",
        LogoUrl: "https://www.inanthao.com//admin/webroot/upload/image/files/logo_anthao_large.png",
        Stats:
        [
            new("7 năm", "kinh nghiệm xưởng in"),
            new("2.400+", "đơn hàng đã giao"),
            new("48h", "in nhanh khi cần"),
        ],
        Ticker: ["In offset", "Ép kim · Ép nhũ", "Cấn bế theo hình", "Giấy mỹ thuật", "Cán bóng / mờ", "Thiết kế miễn phí", "Giao toàn quốc", "Xuất hoá đơn VAT"],
        Ticker2: ["Thiệp cưới", "Tem nhãn", "Hộp giấy", "Túi giấy", "Name card", "Menu", "Hoá đơn", "Standee", "Catalogue", "Voucher"],
        Steps:
        [
            new("01", "Chọn mẫu", "Xem mẫu sẵn hoặc gửi ý tưởng của bạn cho xưởng."),
            new("02", "Thiết kế miễn phí", "Dàn trang nội dung, gửi bản xem trước để bạn duyệt."),
            new("03", "In & gia công", "In offset, ép kim, cấn bế theo đúng bản đã duyệt."),
            new("04", "Giao hàng", "Đóng gói cẩn thận, giao tận nơi toàn quốc."),
        ],
        Why:
        [
            new("01", "Giá gốc tại xưởng", "Không qua trung gian, báo giá minh bạch theo số lượng và chất liệu."),
            new("02", "Sửa file không giới hạn", "Đội thiết kế nội bộ chỉnh đến khi bạn duyệt, không tính phí."),
            new("03", "In thử trước khi in thật", "Bạn cầm bản mẫu thật trên tay rồi mới chốt số lượng."),
            new("04", "Đúng hẹn, giao tận nơi", "Theo dõi tiến độ qua Zalo; giao COD toàn quốc."),
        ],
        Perks: ["Thiết kế và dàn trang miễn phí", "Xem mẫu in thật trước khi in số lượng", "Giảm 15% cho đơn từ 500 sản phẩm"]);
}
