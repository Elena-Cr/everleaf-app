using System.Text;
using Microsoft.AspNetCore.Authorization;
using Everleaf.Model.Repositories;

namespace Everleaf.Server.Middleware;

public class BasicAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public BasicAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        // Skip authentication for endpoints marked with [AllowAnonymous]
        if (context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
        {
            await _next(context);
            return;
        }

        // Get Authorization header
        string? authHeader = context.Request.Headers["Authorization"];

        if (authHeader == null || !authHeader.StartsWith("Basic "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Authorization Header value not provided or not Basic");
            return;
        }

        try
        {
            // Decode Basic auth credentials
            var authBase64 = authHeader.Substring("Basic ".Length).Trim();
            var credentialBytes = Convert.FromBase64String(authBase64);
            var credentials = Encoding.UTF8.GetString(credentialBytes);

            // Parse username and password
            var parts = credentials.Split(':', 2);
            if (parts.Length != 2)
            {
                throw new FormatException("Invalid Basic authentication header format");
            }
            var username = parts[0];
            var password = parts[1];

            // Validate credentials using scoped UserRepository
            using (var scope = serviceProvider.CreateScope())
            {
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
                var user = userRepository.GetUserByUsername(username);

                // TODO: Should be replaced with secure password hash verification if project is produced further
                if (user != null && user.password == password)
                {
                    await _next(context);
                }
                else
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Incorrect credentials provided");
                    return;
                }
            }
        }
        catch (FormatException)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid Authorization Header format");
            return;
        }
        catch (Exception)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("An internal server error occurred.");
            return;
        }
    }
}

// Extension method for middleware registration
public static class BasicAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseBasicAuthenticationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<BasicAuthenticationMiddleware>();
    }
}