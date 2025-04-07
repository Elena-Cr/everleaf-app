public class ProblemReport(int id)
{
    public int Id { get; set; } = id; public int PlantId { get; set; }  // FK to Plant
    public DateTime DateReported { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; } // "Low", "Medium", "High"
}
