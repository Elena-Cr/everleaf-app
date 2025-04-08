namespace Everleaf.Model.DTOs
{
    public class ProblemReportDTO
    {
        public int Id { get; set; }
        public int PlantId { get; set; }
        public DateTime DateReported { get; set; }
        public string Description { get; set; }
        public string Severity { get; set; } // "Low", "Medium", "High"
    }
    public class CreateProblemReportDTO
    {
        public int PlantId { get; set; }
        public string Description { get; set; }
        public string Severity { get; set; }
    }
}
