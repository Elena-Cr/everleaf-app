namespace Everleaf.Model.Entities;
using System;
public class Plant
{
    public Plant() {} 
    public int Id { get; set; } // Unique identifier for the plant
    public string? Name { get; set; } 
    public string? Nickname { get; set; }
    public int? Species { get; set; }  // FK to PlantType - Changed to nullable int
    public string? ImageUrl { get; set; }
    public DateTime DateAdded { get; set; } //Date the plant was added 
    public int UserId { get; set; }  // FK to User
}