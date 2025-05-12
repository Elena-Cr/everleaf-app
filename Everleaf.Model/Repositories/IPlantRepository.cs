using Everleaf.Model.Entities;

namespace Everleaf.Model.Repositories
{
    public interface IPlantRepository
    {
        Plant? GetPlantById(int id);
        List<Plant> GetAllPlants(); 
        List<Plant> GetPlantsByUserId(int userId);
        bool InsertPlant(Plant plant);
        bool UpdatePlant(Plant plant);
        bool DeletePlant(int id);
    }
}
