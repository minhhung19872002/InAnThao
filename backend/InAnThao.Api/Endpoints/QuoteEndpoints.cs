using InAnThao.Api.Contracts;
using InAnThao.Api.Data;
using InAnThao.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Endpoints;

public static class QuoteEndpoints
{
    public static IEndpointRouteBuilder MapQuotes(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/api/quotes").WithTags("Quotes");

        g.MapPost("/", async (QuoteRequestDto dto, AppDbContext db, CancellationToken ct) =>
        {
            var errors = new Dictionary<string, string[]>();
            if (string.IsNullOrWhiteSpace(dto.CustomerName)) errors["customerName"] = ["Vui lòng nhập họ tên"];
            var phone = new string((dto.Phone ?? "").Where(char.IsDigit).ToArray());
            if (phone.Length < 9 || phone.Length > 11) errors["phone"] = ["Số điện thoại không hợp lệ"];
            if (dto.Quantity <= 0) errors["quantity"] = ["Số lượng phải lớn hơn 0"];
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            decimal basePrice = 0;
            decimal pm = 1, fm = 1;
            Product? product = null;
            if (!string.IsNullOrWhiteSpace(dto.ProductSlug))
                product = await db.Products.Include(p => p.Category).ThenInclude(c => c!.PaperOptions)
                    .FirstOrDefaultAsync(p => p.Slug == dto.ProductSlug, ct);

            var category = product?.Category ?? await db.Categories.Include(c => c.PaperOptions)
                .FirstOrDefaultAsync(c => c.Name == dto.ProductType || c.Slug == dto.ProductType, ct);

            basePrice = product?.BasePrice ?? category?.BasePrice ?? 0;
            if (!string.IsNullOrWhiteSpace(dto.Paper))
                pm = category?.PaperOptions.FirstOrDefault(o => o.Label == dto.Paper)?.Multiplier ?? 1;
            if (!string.IsNullOrWhiteSpace(dto.Finish))
                fm = (await db.FinishOptions.FirstOrDefaultAsync(f => f.Label == dto.Finish, ct))?.Multiplier ?? 1;

            var est = PricingService.Estimate(basePrice, dto.Quantity, pm, fm);

            var entity = new QuoteRequest
            {
                ProductType = category?.Name ?? dto.ProductType,
                ProductSlug = product?.Slug,
                CustomerName = dto.CustomerName.Trim(),
                Phone = dto.Phone!.Trim(),
                Quantity = dto.Quantity,
                Note = dto.Note?.Trim(),
                Paper = dto.Paper,
                Finish = dto.Finish,
                EstimatedTotal = est.Total,
            };
            db.QuoteRequests.Add(entity);
            await db.SaveChangesAsync(ct);

            return Results.Created($"/api/quotes/{entity.Id}",
                new QuoteResponseDto(entity.Id, entity.EstimatedTotal, entity.Status, entity.CreatedAt));
        });

        g.MapGet("/", async (AppDbContext db, CancellationToken ct) =>
            await db.QuoteRequests.AsNoTracking().OrderByDescending(q => q.CreatedAt).Take(200).ToListAsync(ct));

        g.MapGet("/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
            await db.QuoteRequests.AsNoTracking().FirstOrDefaultAsync(q => q.Id == id, ct) is { } q
                ? Results.Ok(q) : Results.NotFound());

        return app;
    }
}
