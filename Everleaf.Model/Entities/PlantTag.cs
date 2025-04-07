namespace Everleaf.Model.Entities;

public class PlantTag
{
    public PlantTag(int plantId, int tagId)
    {
        PlantId = plantId;
        TagId = tagId;
    }

    public int PlantId { get; set; }
    public int TagId { get; set; }
}
