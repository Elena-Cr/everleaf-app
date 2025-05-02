using System.ComponentModel.DataAnnotations;

namespace Everleaf.Model.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public required string Username { get; set; }

        [EmailAddress(ErrorMessage = "Please provide a valid email address")]
        public string? Email { get; set; }
    }

    public class CreateUserDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        public required string PasswordHash { get; set; }

        [EmailAddress(ErrorMessage = "Please provide a valid email address")]
        public string? Email { get; set; }
    }

    public class UserLoginDTO
    {
        [Required(ErrorMessage = "Username is required")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public required string PasswordHash { get; set; }
    }

    public class UserRegisterDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        public required string PasswordHash { get; set; }

        [EmailAddress(ErrorMessage = "Please provide a valid email address")]
        public string? Email { get; set; }
    }
}
