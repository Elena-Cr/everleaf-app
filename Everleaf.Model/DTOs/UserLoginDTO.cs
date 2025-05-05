public class UserLoginDTO
{
    public string Username { get; set; }
    public string password { get; set; }
}

// DTOs/UserRegisterDTO.cs
public class UserRegisterDTO
{
    public string Username { get; set; }
    public string password { get; set; }
    public string? Email { get; set; }
}
