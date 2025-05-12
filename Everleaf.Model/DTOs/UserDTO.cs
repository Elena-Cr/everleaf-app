namespace Everleaf.Model.DTOs
{
    // Data Transfer Object (DTO) for representing user data in API responses
    public class UserDTO
    {
        public int Id { get; set; } // Unique identifier for the user
        public string Username { get; set; } 
        public string Email { get; set; } 
    }

    // DTO for creating a new user in API requests
    public class CreateUserDTO
    {
        public string Username { get; set; } 
        public string password { get; set; } 
        public string Email { get; set; } 
    }
}
