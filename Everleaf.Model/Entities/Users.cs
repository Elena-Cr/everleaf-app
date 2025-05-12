namespace Everleaf.Model.Entities;

public class Users
{
    //Constructors
    public Users(int id) { Id = id; } // Constructor to initialize the Users with an ID
    public Users(){} // Default constructor for the Users class
    //Properties
    public int Id { get; set; } // Unique identifier for the user
    public string? Username { get; set; } 
    public string? password { get; set; }
    public string? Email { get; set; }
}
