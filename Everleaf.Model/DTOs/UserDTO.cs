namespace Everleaf.Model.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }

     public class CreateUserDTO
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; } // Consider hashing this in backend later
        public string Email { get; set; }
    }
}
