public class PlantType(int id)
{
    public int Id { get; set; } = id; public string? CommonName { get; set; }
    public string? ScientificName { get; set; }
    public int WateringFrequencyDays { get; set; }
    public int FertilizingFrequencyDays { get; set; }
    public string? SunlightNeeds { get; set; }
}
