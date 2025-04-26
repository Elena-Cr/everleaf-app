namespace Everleaf.Model.DTOs
{
    public class ProblemReportDTO
    {
        public int Id { get; set; }
        public int PlantId { get; set; }
        public DateTime DateReported { get; set; }
        public required string Description { get; set; }
        public required string Severity { get; set; } // "Low", "Medium", "High"
    }
    public class CreateProblemReportDTO
    {
        public int PlantId { get; set; }
        public DateTime? DateReported { get; set; }
        public required string Description { get; set; }
        public required string Severity {get; set; }
    }
}
