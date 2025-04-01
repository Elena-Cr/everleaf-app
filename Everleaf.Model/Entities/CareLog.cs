public class CareLog
{
    public CareLog(int id) { Id = id; }
    public int Id { get; set; }
    public int PlantId { get; set; } // FK to Plant
    public DateTime Date { get; set; }
    public string Type { get; set; } // "Water" or "Fertilizer"
}
