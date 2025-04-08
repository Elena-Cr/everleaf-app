namespace Everleaf.Model.Entities;

public class Tag
{
    public Tag(int id)
    {
        Id = id;
    }

    public int Id { get; set; }
    public string? Name { get; set; }
}
