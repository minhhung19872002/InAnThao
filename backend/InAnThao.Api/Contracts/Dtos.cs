namespace InAnThao.Api.Contracts;

public record OptionDto(int Id, string Label, decimal Multiplier);
public record SpecDto(string Key, string Value);

public record CategoryDto(
    int Id, string Name, string Slug, decimal BasePrice,
    IReadOnlyList<string> SubLabels,
    IReadOnlyList<OptionDto> PaperOptions,
    IReadOnlyList<SpecDto> Specs);

public record ProductDto(
    int Id, string Name, string Slug, string Category, string CategorySlug,
    string PriceLabel, decimal BasePrice, string ImageUrl, string Description);

public record ProductDetailDto(
    ProductDto Product,
    IReadOnlyList<OptionDto> PaperOptions,
    IReadOnlyList<OptionDto> Finishes,
    IReadOnlyList<SpecDto> Specs,
    IReadOnlyList<string> Gallery,
    IReadOnlyList<ProductDto> Related);

public record QuoteRequestDto(
    string ProductType, string CustomerName, string Phone, int Quantity,
    string? Note, string? ProductSlug, string? Paper, string? Finish);

public record QuoteResponseDto(int Id, decimal EstimatedTotal, string Status, DateTime CreatedAt);

public record EstimateDto(decimal UnitPrice, decimal Total, bool Discounted, decimal DiscountRate);

public record SiteInfoDto(
    string Name, string Tagline, string Phone, string Email, string Hours, string LogoUrl,
    IReadOnlyList<StatDto> Stats, IReadOnlyList<string> Ticker,
    IReadOnlyList<StepDto> Steps, IReadOnlyList<StepDto> Why, IReadOnlyList<string> Perks);

public record StatDto(string N, string L);
public record StepDto(string N, string T, string D);
