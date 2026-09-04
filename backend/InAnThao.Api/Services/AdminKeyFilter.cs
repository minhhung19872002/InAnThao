namespace InAnThao.Api.Services;

/// <summary>
/// Minimal admin protection: requests must carry header "X-Admin-Key" equal to config "Admin:Password"
/// (env ADMIN_PASSWORD in docker-compose). Good enough for a single-owner shop backoffice.
/// </summary>
public class AdminKeyFilter(IConfiguration config) : IEndpointFilter
{
    public const string HeaderName = "X-Admin-Key";

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var expected = config["Admin:Password"];
        if (string.IsNullOrEmpty(expected))
            return Results.Problem("Admin password is not configured (Admin:Password).", statusCode: 503);

        var provided = ctx.HttpContext.Request.Headers[HeaderName].FirstOrDefault();
        if (provided is null || !FixedTimeEquals(provided, expected))
            return Results.Unauthorized();

        return await next(ctx);
    }

    private static bool FixedTimeEquals(string a, string b)
    {
        var ba = System.Text.Encoding.UTF8.GetBytes(a);
        var bb = System.Text.Encoding.UTF8.GetBytes(b);
        return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(ba, bb);
    }
}
