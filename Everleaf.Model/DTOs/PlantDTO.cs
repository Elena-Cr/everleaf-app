namespace Everleaf.Model.DTOs
{
    public class PlantDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Nickname { get; set; }
        public int Species { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime DateAdded { get; set; }
        public int UserId { get; set; }
    }

    public class CreatePlantDTO
    {
        public string Name { get; set; }
        public string? Nickname { get; set; }
        public int Species { get; set; }
        public string? ImageUrl { get; set; }
        public int UserId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
