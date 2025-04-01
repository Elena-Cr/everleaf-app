public class PlantTag
{
    public PlantTag(int plantId, int tagId)
    {
        PlantId = plantId;
        TagId = tagId;
    }
    public int PlantId { get; set; }  // FK to Plant
    public int TagId { get; set; }  // FK to Tag
}
