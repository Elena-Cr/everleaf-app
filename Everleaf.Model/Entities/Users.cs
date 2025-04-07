public class Users(int id)
{
    public int Id { get; set; } = id; public string? Username { get; set; }
    public string? PasswordHash { get; set; }
    public string? Email { get; set; }
}
