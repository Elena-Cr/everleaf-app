using Everleaf.Model.Entities;

namespace Everleaf.Model.Repositories
{
    public interface IPlantTypeRepository
    {
        PlantType? GetPlantTypeById(int id);
        List<PlantType> GetAllPlantType();
        bool InsertPlantType(PlantType pt);
        bool UpdatePlantType(PlantType pt);
        bool DeletePlantType(int id);
    }
}
