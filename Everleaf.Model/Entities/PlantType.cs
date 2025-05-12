namespace Everleaf.Model.Entities;

public class PlantType
{
    public PlantType(int id)
    {
        Id = id;
    } // Constructor to initialize the PlantType with an ID

    public int Id { get; set; }
    public string? CommonName { get; set; }
    public string? ScientificName { get; set; }
    public int WateringFrequencyDays { get; set; }
    public int FertilizingFrequencyDays { get; set; }
    public string? SunlightNeeds { get; set; }
}
