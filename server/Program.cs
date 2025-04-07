using Everleaf.Model.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register services and repositories
builder.Services.AddControllers(); // Enables API controllers
builder.Services.AddScoped<CareLogRepository, CareLogRepository>();

var app = builder.Build();

// Middleware pipeline
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); // Enables routing to your controllers

app.Run();
