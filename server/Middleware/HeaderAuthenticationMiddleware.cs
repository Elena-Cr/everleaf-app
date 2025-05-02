namespace Everleaf.Server.Middleware;
public class HeaderAuthenticationMiddleware {
    private const string MY_SECRET_VALUE = "Abc123!!!";
    private readonly RequestDelegate _next;
    public HeaderAuthenticationMiddleware(RequestDelegate next) {
    _next = next;
    }
    public async Task InvokeAsync(HttpContext context) {
    // 1. Try to retrive the Request Header containing our secret value
    string? authHeaderValue = context.Request.Headers["X-My-Request-Header"];
    // 2. if not found, then return with Unauthorized response
    if (string.IsNullOrWhiteSpace(authHeaderValue)) {
    context.Response.StatusCode = 401;
    await context.Response.WriteAsync("Authorisation Header value not provided");
    return;
    }
    // 3. If the secret value is NOT correct, return with Unauthorized response
    if (!string.Equals(authHeaderValue, MY_SECRET_VALUE)) {
    context.Response.StatusCode = 401;
    await context.Response.WriteAsync("Authorisation Header value incorrect");
    return;
    }
    // 4. Continue with the request
    await _next(context);
    }
}
public static class HeaderAuthenticationMiddlewareExtensions {
    public static IApplicationBuilder UseHeaderAuthenticationMiddleware(this
    IApplicationBuilder builder) {
    return builder.UseMiddleware<HeaderAuthenticationMiddleware>();
    }
}