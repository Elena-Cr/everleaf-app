using Everleaf.Model.Entities;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public interface IProblemReportRepository
    {
        ProblemReport? GetReportById(int id);
        List<ProblemReport> GetAllReports();
        List<ProblemReport> GetReportsByUserId(int userId);
        List<ProblemReport> GetReportsByPlantId(int plantId);
        bool InsertReport(ProblemReport report);
        bool UpdateReport(ProblemReport report);
        bool DeleteReport(int id);
    }
}
