namespace Everleaf.Model.DTOs
{
    // Data Transfer Object (DTO) for representing user data in API responses
    public class UserDTO
    {
        public int Id { get; set; } 
        public required string Username { get; set; } 
        public required string Email { get; set; } 
    }

    // DTO for creating a new user in API requests
    public class CreateUserDTO
    {
        public required string Username { get; set; } 
        public required string password { get; set; } 
        public required string Email { get; set; } 
    }
}
