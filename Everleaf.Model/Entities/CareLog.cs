namespace Everleaf.Model.Entities
{
    public class CareLog(int id)
    {
        public int Id { get; set; } = id; // Unique identifier for the care log entry
        public int PlantId { get; set; } // FK to Plant
        public DateTime Date { get; set; } // Date of the care action
        public string? Type { get; set; } // "Water" or "Fertilizer"
    }
}
