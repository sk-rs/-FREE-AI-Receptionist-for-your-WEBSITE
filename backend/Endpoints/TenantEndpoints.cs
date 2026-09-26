using AIReceptionist.Data;
using AIReceptionist.Models;
using AIReceptionist.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIReceptionist.Endpoints;

public record UpdateWidgetConfigRequest(
    string? PrimaryColor,
    string? TextColor,
    string? FontFamily,
    string? LauncherIcon,
    string? CustomIconUrl,
    string? Position,
    string? WelcomeMessage,
    string? PlaceholderText
);

public static class TenantEndpoints
{
    public static void MapTenantEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tenants");

        // Public endpoint: Get widget customization for a tenant slug (called by widget.js)
        group.MapGet("/{slug}/widget-config", async (string slug, AppDbContext db) =>
        {
            var tenant = await db.Tenants
                .Where(t => t.Slug == slug && t.IsActive)
                .Select(t => new
                {
                    businessName = t.BusinessName,
                    industry = t.Industry,
                    primaryColor = t.PrimaryColor,
                    textColor = t.TextColor,
                    fontFamily = t.FontFamily,
                    launcherIcon = t.LauncherIcon,
                    customIconUrl = t.CustomIconUrl,
                    position = t.Position,
                    welcomeMessage = t.WelcomeMessage,
                    placeholderText = t.PlaceholderText
                })
                .FirstOrDefaultAsync();

            return tenant is not null ? Results.Ok(tenant) : Results.NotFound($"Tenant '{slug}' not found.");
        });

        // Tenant or Admin: Update widget customization
        group.MapPut("/{slug}/widget-config", async (
            string slug,
            UpdateWidgetConfigRequest req,
            [FromHeader(Name = "X-Admin-Key")] string? xAdminKey,
            [FromHeader(Name = "X-Tenant-Key")] string? xTenantKey,
            AppDbContext db,
            IConfiguration config) =>
        {
            var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == slug);
            if (tenant is null) return Results.NotFound($"Tenant '{slug}' not found.");

            var isAdmin = ApiKeyAuth.IsValidAdminKey(xAdminKey, config);
            var isTenant = await ApiKeyAuth.IsValidTenantKeyAsync(xTenantKey, tenant.Id, db);
            if (!isAdmin && !isTenant) return Results.Unauthorized();

            if (!string.IsNullOrWhiteSpace(req.PrimaryColor)) tenant.PrimaryColor = req.PrimaryColor;
            if (!string.IsNullOrWhiteSpace(req.TextColor)) tenant.TextColor = req.TextColor;
            if (!string.IsNullOrWhiteSpace(req.FontFamily)) tenant.FontFamily = req.FontFamily;
            if (!string.IsNullOrWhiteSpace(req.LauncherIcon)) tenant.LauncherIcon = req.LauncherIcon;
            if (req.CustomIconUrl != null) tenant.CustomIconUrl = req.CustomIconUrl;
            if (!string.IsNullOrWhiteSpace(req.Position)) tenant.Position = req.Position;
            if (!string.IsNullOrWhiteSpace(req.WelcomeMessage)) tenant.WelcomeMessage = req.WelcomeMessage;
            if (!string.IsNullOrWhiteSpace(req.PlaceholderText)) tenant.PlaceholderText = req.PlaceholderText;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                tenant.Slug,
                tenant.PrimaryColor,
                tenant.TextColor,
                tenant.FontFamily,
                tenant.LauncherIcon,
                tenant.CustomIconUrl,
                tenant.Position,
                tenant.WelcomeMessage,
                tenant.PlaceholderText
            });
        });

        // Admin: List all tenants
        group.MapGet("/", async ([FromHeader(Name = "X-Admin-Key")] string? xAdminKey, AppDbContext db, IConfiguration config) =>
        {
            if (!ApiKeyAuth.IsValidAdminKey(xAdminKey, config)) return Results.Unauthorized();
            return Results.Ok(await db.Tenants.ToListAsync());
        });

        // Admin: Get tenant details
        group.MapGet("/{slug}", async (string slug, [FromHeader(Name = "X-Admin-Key")] string? xAdminKey, AppDbContext db, IConfiguration config) =>
        {
            if (!ApiKeyAuth.IsValidAdminKey(xAdminKey, config)) return Results.Unauthorized();

            var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == slug);
            return tenant is not null ? Results.Ok(tenant) : Results.NotFound();
        });

        // Admin: Create tenant
        group.MapPost("/", async (Tenant tenant, [FromHeader(Name = "X-Admin-Key")] string? xAdminKey, AppDbContext db, IConfiguration config) =>
        {
            if (!ApiKeyAuth.IsValidAdminKey(xAdminKey, config)) return Results.Unauthorized();

            var exists = await db.Tenants.AnyAsync(t => t.Slug == tenant.Slug);
            if (exists) return Results.Conflict($"A tenant with slug '{tenant.Slug}' already exists.");

            db.Tenants.Add(tenant);
            await db.SaveChangesAsync();
            return Results.Created($"/api/tenants/{tenant.Slug}", tenant);
        });

        // Admin: Regenerate API key
        group.MapPost("/{slug}/regenerate-key", async (string slug, [FromHeader(Name = "X-Admin-Key")] string? xAdminKey, AppDbContext db, IConfiguration config) =>
        {
            if (!ApiKeyAuth.IsValidAdminKey(xAdminKey, config)) return Results.Unauthorized();

            var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == slug);
            if (tenant is null) return Results.NotFound();

            tenant.ApiKey = Guid.NewGuid().ToString("N");
            await db.SaveChangesAsync();

            return Results.Ok(new { tenant.Slug, tenant.ApiKey });
        });
    }
}
