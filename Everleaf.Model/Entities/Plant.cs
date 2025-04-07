public class Plant(int id)
{
    public int Id { get; set; } = id; public string? Name { get; set; }
    public string? Nickname { get; set; }
    public int Species { get; set; }  // FK to PlantType
    public string? ImageUrl { get; set; }
    public DateTime DateAdded { get; set; }
    public int UserId { get; set; }  // FK to User
}
