using Everleaf.Model.Repositories;
using Everleaf.Model;
using Everleaf.Server.Middleware;

// Initialize the application builder
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


#region Service Registration
// Add controllers for handling HTTP requests
builder.Services.AddControllers();

// Register repositories with dependency injection
// Each repository is scoped to the HTTP request lifetime
builder.Services.AddScoped<CareLogRepository>();
// Register the interface and its implementation
builder.Services.AddScoped<IPlantRepository, PlantRepository>(); 
builder.Services.AddScoped<PlantTypeRepository>();
builder.Services.AddScoped<ProblemReportRepository>();
builder.Services.AddScoped<UserRepository>();

// Configure AutoMapper for object-to-object mapping
builder.Services.AddAutoMapper(typeof(MappingProfile));
#endregion

// Build the application
var app = builder.Build();
app.UseCors("AllowFrontend");


#region Middleware Configuration
// Configure the HTTP request pipeline
app.UseBasicAuthenticationMiddleware(); // <-- Uncommented this line

// Enable authorization middleware
// app.UseAuthorization(); // This might be needed depending on how you mix auth types later

// Enable endpoint routing for controllers
app.MapControllers();
#endregion

// Start the application
app.Run();
