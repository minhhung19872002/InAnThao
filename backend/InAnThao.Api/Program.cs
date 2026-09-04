using InAnThao.Api.Data;
using InAnThao.Api.Endpoints;
using InAnThao.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? "Host=localhost;Port=5432;Database=inanthao;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));
builder.Services.AddOpenApi();
builder.Services.AddAntiforgery();
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o => o.MultipartBodyLengthLimit = 12 * 1024 * 1024);
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:5173"])
     .AllowAnyHeader().AllowAnyMethod()));
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

var app = builder.Build();

// Apply migrations + seed catalogue data on startup (retry while Postgres container is warming up).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    for (var attempt = 1; ; attempt++)
    {
        try
        {
            await db.Database.MigrateAsync();
            await DbSeeder.SeedAsync(db);
            break;
        }
        catch (Exception ex) when (attempt < 10)
        {
            logger.LogWarning(ex, "Database not ready (attempt {Attempt}), retrying...", attempt);
            await Task.Delay(TimeSpan.FromSeconds(3));
        }
    }
}

app.UseCors();

// Uploaded product images: /uploads/** (volume-mounted in Docker).
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(AdminProductEndpoints.UploadsRoot(app.Configuration, app.Environment)),
    RequestPath = "/uploads",
    OnPrepareResponse = ctx => ctx.Context.Response.Headers.CacheControl = "public,max-age=2592000",
});
app.UseAntiforgery();
app.MapOpenApi();
app.MapGet("/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));
app.MapCatalog();
app.MapQuotes();
app.MapAdmin();
app.MapAdminProducts();

app.Run();
