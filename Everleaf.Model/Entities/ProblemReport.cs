namespace Everleaf.Model.Entities;

public class ProblemReport
{
    public ProblemReport() {} 
    public ProblemReport(int id) { Id = id;  } // Constructor to initialize the ProblemReport with an ID
    public int Id { get; set; } //Unique identifier for the problem report entry
    public int PlantId { get; set; } // FK to Plant
    public DateTime DateReported { get; set; } // Date when the problem was reported
    public string? Description { get; set; } // Description of the problem 
    public string? Severity { get; set; } // "Low", "Medium", "High"
}
