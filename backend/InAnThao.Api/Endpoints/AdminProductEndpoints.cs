using InAnThao.Api.Data;
using InAnThao.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Endpoints;

public record ProductUpsertDto(
    string Name, string? Slug, int CategoryId, string PriceLabel, decimal? BasePrice,
    string ImageUrl, string Description, int SortOrder, bool IsActive);

public record AdminProductDto(
    int Id, string Name, string Slug, int CategoryId, string Category, string PriceLabel, decimal BasePrice,
    string ImageUrl, string Description, int SortOrder, bool IsActive);

public record UploadResultDto(string Url, string FileName, long Size);

/// <summary>Admin CRUD for products + image upload. All routes require X-Admin-Key.</summary>
public static class AdminProductEndpoints
{
    private static readonly string[] AllowedExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    private const long MaxUpload = 10 * 1024 * 1024;

    public static IEndpointRouteBuilder MapAdminProducts(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/api/admin").WithTags("Admin products").AddEndpointFilter<AdminKeyFilter>();

        g.MapGet("/categories", async (AppDbContext db, CancellationToken ct) =>
            await db.Categories.AsNoTracking().OrderBy(c => c.SortOrder)
                .Select(c => new { c.Id, c.Name, c.Slug, c.BasePrice }).ToListAsync(ct));

        g.MapGet("/products", async (AppDbContext db, CancellationToken ct) =>
            await db.Products.AsNoTracking().Include(p => p.Category)
                .OrderBy(p => p.SortOrder).ThenBy(p => p.Id)
                .Select(p => ToDto(p)).ToListAsync(ct));

        g.MapGet("/products/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
            await db.Products.AsNoTracking().Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id, ct) is { } p
                ? Results.Ok(ToDto(p)) : Results.NotFound());

        g.MapPost("/products", async (ProductUpsertDto dto, AppDbContext db, CancellationToken ct) =>
        {
            var err = await Validate(dto, db, ct);
            if (err is not null) return err;

            var p = new Product();
            Apply(p, dto);
            p.Slug = await UniqueSlug(db, string.IsNullOrWhiteSpace(dto.Slug) ? DbSeeder.Slugify(dto.Name) : DbSeeder.Slugify(dto.Slug), null, ct);
            if (p.SortOrder == 0) p.SortOrder = (await db.Products.MaxAsync(x => (int?)x.SortOrder, ct) ?? 0) + 1;
            db.Products.Add(p);
            await db.SaveChangesAsync(ct);
            await db.Entry(p).Reference(x => x.Category).LoadAsync(ct);
            return Results.Created($"/api/admin/products/{p.Id}", ToDto(p));
        });

        g.MapPut("/products/{id:int}", async (int id, ProductUpsertDto dto, AppDbContext db, CancellationToken ct) =>
        {
            var p = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id, ct);
            if (p is null) return Results.NotFound();
            var err = await Validate(dto, db, ct);
            if (err is not null) return err;

            Apply(p, dto);
            // Keep the existing slug (stable URLs) unless the admin explicitly sets a new one.
            if (!string.IsNullOrWhiteSpace(dto.Slug) && DbSeeder.Slugify(dto.Slug) != p.Slug)
                p.Slug = await UniqueSlug(db, DbSeeder.Slugify(dto.Slug), p.Id, ct);
            await db.SaveChangesAsync(ct);
            await db.Entry(p).Reference(x => x.Category).LoadAsync(ct);
            return Results.Ok(ToDto(p));
        });

        g.MapPatch("/products/{id:int}/active", async (int id, QuoteStatusDto _, AppDbContext db, CancellationToken ct) =>
        {
            var p = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id, ct);
            if (p is null) return Results.NotFound();
            p.IsActive = !p.IsActive;
            await db.SaveChangesAsync(ct);
            return Results.Ok(ToDto(p));
        });

        g.MapDelete("/products/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
        {
            var p = await db.Products.FindAsync([id], ct);
            if (p is null) return Results.NotFound();
            db.Products.Remove(p);
            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        g.MapPost("/upload", async (IFormFile file, IConfiguration config, IWebHostEnvironment env, CancellationToken ct) =>
        {
            if (file.Length == 0) return Results.BadRequest("Empty file");
            if (file.Length > MaxUpload) return Results.BadRequest("File quá lớn (tối đa 10MB)");
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExt.Contains(ext)) return Results.BadRequest("Chỉ nhận ảnh jpg, png, webp, gif");

            var root = UploadsRoot(config, env);
            var sub = DateTime.UtcNow.ToString("yyyy/MM");
            var dir = Path.Combine(root, sub);
            Directory.CreateDirectory(dir);
            var name = $"{DbSeeder.Slugify(Path.GetFileNameWithoutExtension(file.FileName))}-{Guid.NewGuid().ToString("N")[..8]}{ext}";
            var path = Path.Combine(dir, name);
            await using (var fs = File.Create(path))
                await file.CopyToAsync(fs, ct);

            return Results.Ok(new UploadResultDto($"/uploads/{sub}/{name}", name, file.Length));
        }).DisableAntiforgery();

        return app;
    }

    public static string UploadsRoot(IConfiguration config, IWebHostEnvironment env)
    {
        var configured = config["Uploads:Path"];
        var root = string.IsNullOrWhiteSpace(configured) ? Path.Combine(env.ContentRootPath, "uploads") : configured;
        Directory.CreateDirectory(root);
        return root;
    }

    private static async Task<IResult?> Validate(ProductUpsertDto dto, AppDbContext db, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(dto.Name)) errors["name"] = ["Tên sản phẩm không được trống"];
        if (string.IsNullOrWhiteSpace(dto.PriceLabel)) errors["priceLabel"] = ["Nhập giá hiển thị, ví dụ: từ 4.500₫"];
        if (!await db.Categories.AnyAsync(c => c.Id == dto.CategoryId, ct)) errors["categoryId"] = ["Danh mục không hợp lệ"];
        return errors.Count > 0 ? Results.ValidationProblem(errors) : null;
    }

    private static void Apply(Product p, ProductUpsertDto dto)
    {
        p.Name = dto.Name.Trim();
        p.CategoryId = dto.CategoryId;
        p.PriceLabel = dto.PriceLabel.Trim();
        p.BasePrice = dto.BasePrice is > 0 ? dto.BasePrice.Value : ParsePrice(dto.PriceLabel);
        p.ImageUrl = (dto.ImageUrl ?? "").Trim();
        p.Description = (dto.Description ?? "").Trim();
        p.SortOrder = dto.SortOrder;
        p.IsActive = dto.IsActive;
    }

    private static decimal ParsePrice(string label)
    {
        var digits = new string(label.Where(char.IsDigit).ToArray());
        return decimal.TryParse(digits, out var v) ? v : 0;
    }

    private static async Task<string> UniqueSlug(AppDbContext db, string baseSlug, int? excludeId, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(baseSlug)) baseSlug = "san-pham";
        var slug = baseSlug;
        for (var i = 2; await db.Products.AnyAsync(p => p.Slug == slug && p.Id != excludeId, ct); i++)
            slug = $"{baseSlug}-{i}";
        return slug;
    }

    private static AdminProductDto ToDto(Product p) => new(
        p.Id, p.Name, p.Slug, p.CategoryId, p.Category?.Name ?? "", p.PriceLabel, p.BasePrice,
        p.ImageUrl, p.Description, p.SortOrder, p.IsActive);
}
