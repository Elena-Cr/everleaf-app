namespace Everleaf.Model.Entities;
using System;
public class Plant
{
    public Plant() {} 
    public int Id { get; set; } 
    public string? Name { get; set; } 
    public string? Nickname { get; set; }

    public int Species { get; set; }  // FK to PlantType
   
    public DateTime DateAdded { get; set; }

    public int UserId { get; set; }  // FK to User
}