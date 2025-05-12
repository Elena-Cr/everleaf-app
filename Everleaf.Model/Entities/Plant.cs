namespace Everleaf.Model.Entities;
using System;
public class Plant
{
    public Plant() {} 
    public int Id { get; set; } // Unique identifier for the plant
    public string? Name { get; set; } 
    public string? Nickname { get; set; }
<<<<<<< HEAD
    public int? Species { get; set; }  // FK to PlantType - Changed to nullable int
    public string? ImageUrl { get; set; }
    public DateTime DateAdded { get; set; } //Date the plant was added 
=======
    public int Species { get; set; }  // FK to PlantType
    public DateTime DateAdded { get; set; }
>>>>>>> daac8346546105ac2e0ffd454ff697be02162e46
    public int UserId { get; set; }  // FK to User
}