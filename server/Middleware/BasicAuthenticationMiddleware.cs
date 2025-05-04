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
        // Bypass authentication for [AllowAnonymous]
        if (context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
        {
            await _next(context);
            return;
        }

        // 1. Try to retrieve the Request Header containing our secret value
        string? authHeader = context.Request.Headers["Authorization"];

        // 2. If not found, then return with Unauthrozied response
        if (authHeader == null || !authHeader.StartsWith("Basic "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Authorization Header value not provided or not Basic");
            return;
        }

        try
        {
            // 3. Extract the Base64 encoded credentials
            var authBase64 = authHeader.Substring("Basic ".Length).Trim();

            // 4. Convert it from Base64 encoded text, back to normal text
            var credentialBytes = Convert.FromBase64String(authBase64);
            var credentials = Encoding.UTF8.GetString(credentialBytes);

            // 5. Extract username and password, which are separated by a colon
            var parts = credentials.Split(':', 2);
            if (parts.Length != 2)
            {
                throw new FormatException("Invalid Basic authentication header format");
            }
            var username = parts[0];
            var password = parts[1]; // This is the plain text password sent by the client

            // 6. Resolve UserRepository and check credentials
            // We resolve it here because middleware is singleton but repository is scoped
            using (var scope = serviceProvider.CreateScope())
            {
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
                var user = userRepository.GetUserByUsername(username);

                // IMPORTANT: You MUST compare the provided password with the stored HASH.
                // Assuming your stored PasswordHash is the actual hash and you have a way to verify it.
                // For this example, I'll assume direct comparison, but you SHOULD use a proper hash verification method (e.g., BCrypt.Net, ASP.NET Core Identity hasher).
                // Replace this check with your actual password hashing verification logic.
                if (user != null && user.PasswordHash == password) // <-- *** REPLACE THIS WITH ACTUAL HASH VERIFICATION ***
                {
                    // TODO: Optionally attach user principal to context if needed downstream
                    // var claims = new[] { new Claim(ClaimTypes.Name, user.Username) };
                    // var identity = new ClaimsIdentity(claims, "Basic");
                    // context.User = new ClaimsPrincipal(identity);

                    await _next(context);
                }
                else
                {
                    // If not, then send Unauthorized response
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
        catch (Exception ex) // Catch other potential errors
        {
            // Log the exception ex
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("An internal server error occurred.");
            return;
        }
    }
}

public static class BasicAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseBasicAuthenticationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<BasicAuthenticationMiddleware>();
    }
}