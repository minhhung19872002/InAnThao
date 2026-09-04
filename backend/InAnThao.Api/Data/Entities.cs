namespace InAnThao.Api.Data;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public int SortOrder { get; set; }
    /// <summary>Base unit price (VND) used for quick estimates.</summary>
    public decimal BasePrice { get; set; }
    public List<string> SubLabels { get; set; } = new();
    public List<PaperOption> PaperOptions { get; set; } = new();
    public List<SpecRow> Specs { get; set; } = new();
    public List<Product> Products { get; set; } = new();
}

public class PaperOption
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Label { get; set; } = "";
    public decimal Multiplier { get; set; } = 1;
    public int SortOrder { get; set; }
}

public class SpecRow
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
    public int SortOrder { get; set; }
}

public class FinishOption
{
    public int Id { get; set; }
    public string Label { get; set; } = "";
    public decimal Multiplier { get; set; } = 1;
    public int SortOrder { get; set; }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    /// <summary>Display label, e.g. "từ 4.500₫" or "liên hệ".</summary>
    public string PriceLabel { get; set; } = "";
    /// <summary>Numeric base price parsed from label (0 when "liên hệ").</summary>
    public decimal BasePrice { get; set; }
    public string ImageUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class QuoteRequest
{
    public int Id { get; set; }
    public string ProductType { get; set; } = "";
    public string? ProductSlug { get; set; }
    public string CustomerName { get; set; } = "";
    public string Phone { get; set; } = "";
    public int Quantity { get; set; }
    public string? Note { get; set; }
    public string? Paper { get; set; }
    public string? Finish { get; set; }
    public decimal EstimatedTotal { get; set; }
    public string Status { get; set; } = "new";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
