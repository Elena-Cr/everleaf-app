using Everleaf.Model.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register services and repositories
builder.Services.AddControllers(); // Enables API controllers
builder.Services.AddScoped<CareLogRepository, CareLogRepository>();
builder.Services.AddScoped<PlantRepository, PlantRepository>();
builder.Services.AddScoped<PlantTagRepository, PlantTagRepository>();
builder.Services.AddScoped<PlantTypeRepository, PlantTypeRepository>();
builder.Services.AddScoped<ProblemReportRepository, ProblemReportRepository>();
builder.Services.AddScoped<TagRepository, TagRepository>();
builder.Services.AddScoped<UserRepository, UserRepository>();





var app = builder.Build();

// Middleware pipeline
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); // Enables routing to your controllers

app.Run();
