namespace Everleaf.Model.Entities;

public class ProblemReport
{
    public ProblemReport(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
    public int PlantId { get; set; } // FK to Plant
    public DateTime DateReported { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; } // "Low", "Medium", "High"
}
