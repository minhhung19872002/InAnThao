using InAnThao.Api.Data;
using InAnThao.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Endpoints;

public record QuoteStatusDto(string Status);
public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);
public record QuoteStatsDto(int Total, int New, int Contacted, int Quoted, int Done, int Cancelled, int Today, decimal EstimatedSum);

public static class AdminEndpoints
{
    public static readonly string[] Statuses = ["new", "contacted", "quoted", "done", "cancelled"];

    public static IEndpointRouteBuilder MapAdmin(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/api/admin").WithTags("Admin").AddEndpointFilter<AdminKeyFilter>();

        // Used by the login screen to validate the password.
        g.MapGet("/me", () => Results.Ok(new { role = "admin" }));

        g.MapGet("/stats", async (AppDbContext db, CancellationToken ct) =>
        {
            var q = db.QuoteRequests.AsNoTracking();
            var todayUtc = DateTime.UtcNow.Date;
            return new QuoteStatsDto(
                await q.CountAsync(ct),
                await q.CountAsync(x => x.Status == "new", ct),
                await q.CountAsync(x => x.Status == "contacted", ct),
                await q.CountAsync(x => x.Status == "quoted", ct),
                await q.CountAsync(x => x.Status == "done", ct),
                await q.CountAsync(x => x.Status == "cancelled", ct),
                await q.CountAsync(x => x.CreatedAt >= todayUtc, ct),
                await q.Where(x => x.Status != "cancelled").SumAsync(x => x.EstimatedTotal, ct));
        });

        g.MapGet("/quotes", async (string? status, string? search, int page, int pageSize, AppDbContext db, CancellationToken ct) =>
        {
            page = Math.Max(1, page);
            pageSize = pageSize is < 1 or > 200 ? 20 : pageSize;

            var q = db.QuoteRequests.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                q = q.Where(x => x.Status == status);
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                q = q.Where(x => EF.Functions.ILike(x.CustomerName, $"%{s}%")
                              || EF.Functions.ILike(x.Phone, $"%{s}%")
                              || EF.Functions.ILike(x.ProductType, $"%{s}%")
                              || (x.Note != null && EF.Functions.ILike(x.Note, $"%{s}%")));
            }

            var total = await q.CountAsync(ct);
            var items = await q.OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
            return new PagedResult<QuoteRequest>(items, total, page, pageSize);
        });

        g.MapGet("/quotes/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
            await db.QuoteRequests.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct) is { } q
                ? Results.Ok(q) : Results.NotFound());

        g.MapPatch("/quotes/{id:int}/status", async (int id, QuoteStatusDto dto, AppDbContext db, CancellationToken ct) =>
        {
            if (!Statuses.Contains(dto.Status)) return Results.BadRequest($"status must be one of: {string.Join(", ", Statuses)}");
            var q = await db.QuoteRequests.FindAsync([id], ct);
            if (q is null) return Results.NotFound();
            q.Status = dto.Status;
            await db.SaveChangesAsync(ct);
            return Results.Ok(q);
        });

        g.MapDelete("/quotes/{id:int}", async (int id, AppDbContext db, CancellationToken ct) =>
        {
            var q = await db.QuoteRequests.FindAsync([id], ct);
            if (q is null) return Results.NotFound();
            db.QuoteRequests.Remove(q);
            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        return app;
    }
}
