using System.ComponentModel.DataAnnotations;

namespace Everleaf.Model.DTOs
{
    // DTO for representing problem report data in API responses
    public class ProblemReportDTO
    {
        public int Id { get; set; } // Unique identifier for the problem report

        [Required(ErrorMessage = "Plant ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid plant ID")]
        public int PlantId { get; set; } // Foreign key linking to the Plant entity

        public DateTime DateReported { get; set; } // Date when the problem was reported

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters")]
        public required string Description { get; set; } // Detailed description of the problem

        [Required(ErrorMessage = "Severity level is required")]
        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Severity must be either 'Low', 'Medium', or 'High'")]
        public required string Severity { get; set; } // Severity level of the problem (e.g., "Low", "Medium", "High")
    }

    // DTO for creating a new problem report in API requests
    public class CreateProblemReportDTO
    {
        [Required(ErrorMessage = "Plant ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid plant ID")]
        public int PlantId { get; set; } // Foreign key linking to the Plant entity

        public DateTime? DateReported { get; set; } // Optional date when the problem was reported

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters")]
        public required string Description { get; set; } // Detailed description of the problem

        [Required(ErrorMessage = "Severity level is required")]
        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Severity must be either 'Low', 'Medium', or 'High'")]
        public required string Severity { get; set; } // Severity level of the problem (e.g., "Low", "Medium", "High")
    }
}
