using Everleaf.Model.Repositories;
using Everleaf.Model;

// Initialize the application builder
var builder = WebApplication.CreateBuilder(args);

#region Service Registration
// Add controllers for handling HTTP requests
builder.Services.AddControllers();

// Register repositories with dependency injection
// Each repository is scoped to the HTTP request lifetime
builder.Services.AddScoped<CareLogRepository>();
builder.Services.AddScoped<PlantRepository>();
builder.Services.AddScoped<PlantTagRepository>();
builder.Services.AddScoped<PlantTypeRepository>();
builder.Services.AddScoped<ProblemReportRepository>();
builder.Services.AddScoped<TagRepository>();
builder.Services.AddScoped<UserRepository>();

// Configure AutoMapper for object-to-object mapping
builder.Services.AddAutoMapper(typeof(MappingProfile));
#endregion

// Build the application
var app = builder.Build();

#region Middleware Configuration
// Configure the HTTP request pipeline

// Uncomment the following line to enforce HTTPS
//app.UseHttpsRedirection();

// Enable authorization middleware
app.UseAuthorization();

// Enable endpoint routing for controllers
app.MapControllers();
#endregion

// Start the application
app.Run();
