using Everleaf.Model.Entities;

namespace Everleaf.Model.Repositories
{
    public interface ICareLogRepository
    {
        CareLog? GetCareLogById(int id);
        List<CareLog> GetAllCareLogs();
        List<CareLog> GetLogsByPlantId(int plantId);
        List<CareLog> GetLogsByUserId(int userId);
        bool InsertCareLog(CareLog log);
        bool UpdateCareLog(CareLog log);
        bool DeleteCareLog(int id);
    }
}
