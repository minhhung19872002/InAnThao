using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PaperOption> PaperOptions => Set<PaperOption>();
    public DbSet<SpecRow> SpecRows => Set<SpecRow>();
    public DbSet<FinishOption> FinishOptions => Set<FinishOption>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<QuoteRequest> QuoteRequests => Set<QuoteRequest>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Category>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Name).HasMaxLength(120);
            e.Property(x => x.Slug).HasMaxLength(120);
            e.Property(x => x.SubLabels).HasColumnType("text[]");
            e.HasMany(x => x.PaperOptions).WithOne().HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Specs).WithOne().HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Products).WithOne(p => p.Category).HasForeignKey(p => p.CategoryId);
        });

        b.Entity<Product>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Name).HasMaxLength(160);
            e.Property(x => x.Slug).HasMaxLength(160);
            e.Property(x => x.PriceLabel).HasMaxLength(60);
            e.Property(x => x.ImageUrl).HasMaxLength(500);
        });

        b.Entity<QuoteRequest>(e =>
        {
            e.Property(x => x.ProductType).HasMaxLength(120);
            e.Property(x => x.CustomerName).HasMaxLength(160);
            e.Property(x => x.Phone).HasMaxLength(30);
            e.Property(x => x.Status).HasMaxLength(30);
            e.HasIndex(x => x.CreatedAt);
        });
    }
}
