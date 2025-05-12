namespace Everleaf.Model.Entities
{
    public class CareLog
    {
         public CareLog(int id)
    {
        Id = id;
    } // Constructor to initialize the CareLog with an ID
        public int Id { get; set; }
        public int PlantId { get; set; } // FK to Plant
        public DateTime Date { get; set; } 
        public string? Type { get; set; } // "Water" or "Fertilizer"
    }
}
