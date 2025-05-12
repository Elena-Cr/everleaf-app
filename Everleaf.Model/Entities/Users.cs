namespace Everleaf.Model.Entities;

public class Users
{
    //Constructors
    public Users(int id) { Id = id; } 
    public Users(){} 

    //Properties
    public int Id { get; set; } // Unique identifier for the user
    public string? Username { get; set; } 
    public string? password { get; set; }
    public string? Email { get; set; }
}
