namespace Everleaf.Model.Entities
{
    public class CareLog(int id)
    {
        public int Id { get; set; } = id; public int PlantId { get; set; } // FK to Plant
        public DateTime Date { get; set; }
        public string? Type { get; set; } // "Water" or "Fertilizer"
    }
}
