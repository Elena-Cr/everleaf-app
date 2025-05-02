using System.ComponentModel.DataAnnotations;

namespace Everleaf.Model.DTOs
{
    public class ProblemReportDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Plant ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid plant ID")]
        public int PlantId { get; set; }

        public DateTime DateReported { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Severity level is required")]
        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Severity must be either 'Low', 'Medium', or 'High'")]
        public required string Severity { get; set; }
    }

    public class CreateProblemReportDTO
    {
        [Required(ErrorMessage = "Plant ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please provide a valid plant ID")]
        public int PlantId { get; set; }

        public DateTime? DateReported { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Severity level is required")]
        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Severity must be either 'Low', 'Medium', or 'High'")]
        public required string Severity { get; set; }
    }
}
