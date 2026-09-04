using InAnThao.Api.Contracts;

namespace InAnThao.Api.Services;

/// <summary>Mirrors the pricing rules of the design: paper × finish multipliers, 15% off from 500 units.</summary>
public static class PricingService
{
    public const int DiscountThreshold = 500;
    public const decimal DiscountRate = 0.15m;

    public static EstimateDto Estimate(decimal basePrice, int quantity, decimal paperMultiplier = 1, decimal finishMultiplier = 1)
    {
        var unit = Math.Round(basePrice * paperMultiplier * finishMultiplier, 0, MidpointRounding.AwayFromZero);
        var discounted = quantity >= DiscountThreshold;
        var total = unit * quantity * (discounted ? 1 - DiscountRate : 1);
        return new EstimateDto(unit, Math.Round(total, 0, MidpointRounding.AwayFromZero), discounted, discounted ? DiscountRate : 0);
    }
}
