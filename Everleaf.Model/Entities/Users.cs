namespace Everleaf.Model.Entities;

public class Users
{
    public Users(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
    public string? Username { get; set; }
    public string? PasswordHash { get; set; }
    public string? Email { get; set; }
}
