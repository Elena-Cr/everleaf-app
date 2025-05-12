using System.ComponentModel.DataAnnotations;

namespace Everleaf.Model.DTOs
{
    public class PlantDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Plant name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public required string Name { get; set; }

        [StringLength(50, ErrorMessage = "Nickname cannot exceed 50 characters")]
        public string? Nickname { get; set; }

        [Required(ErrorMessage = "Species is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid species")]
        public int Species { get; set; }


        public DateTime DateAdded { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid user ID")]
        public int UserId { get; set; }
    }

    public class CreatePlantDTO
    {
        [Required(ErrorMessage = "Plant name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public required string Name { get; set; }

        [StringLength(50, ErrorMessage = "Nickname cannot exceed 50 characters")]
        public string? Nickname { get; set; }

        [Required(ErrorMessage = "Species is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid species")]
        public int Species { get; set; }


        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid user ID")]
        public int UserId { get; set; }

        public DateTime DateAdded { get; set; }
    }
}
