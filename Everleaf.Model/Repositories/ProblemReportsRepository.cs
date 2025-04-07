using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class ProblemReportRepository : BaseRepository
    {
        public ProblemReportRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public ProblemReport? GetReportById(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM ProblemReports WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new ProblemReport(Convert.ToInt32(data["id"]))
                {
                    PlantId = Convert.ToInt32(data["plantid"]),
                    DateReported = Convert.ToDateTime(data["datereported"]),
                    Description = data["description"].ToString(),
                    Severity = data["severity"].ToString()
                };
            }

            return null;
        }

        public List<ProblemReport> GetAllReports()
        {
            var reports = new List<ProblemReport>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM ProblemReports";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                reports.Add(new ProblemReport(Convert.ToInt32(data["id"]))
                {
                    PlantId = Convert.ToInt32(data["plantid"]),
                    DateReported = Convert.ToDateTime(data["datereported"]),
                    Description = data["description"].ToString(),
                    Severity = data["severity"].ToString()
                });
            }

            return reports;
        }

        public bool InsertReport(ProblemReport report)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO ProblemReports (plantid, datereported, description, severity)
                VALUES (@plantid, @datereported, @description, @severity)";

            cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, report.PlantId);
            cmd.Parameters.AddWithValue("@datereported", NpgsqlDbType.Timestamp, report.DateReported);
            cmd.Parameters.AddWithValue("@description", NpgsqlDbType.Text, report.Description ?? "");
            cmd.Parameters.AddWithValue("@severity", NpgsqlDbType.Text, report.Severity ?? "");

            return InsertData(dbConn, cmd);
        }

        public bool UpdateReport(ProblemReport report)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE ProblemReports SET
                    plantid = @plantid,
                    datereported = @datereported,
                    description = @description,
                    severity = @severity
                WHERE id = @id";

            cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, report.PlantId);
            cmd.Parameters.AddWithValue("@datereported", NpgsqlDbType.Timestamp, report.DateReported);
            cmd.Parameters.AddWithValue("@description", NpgsqlDbType.Text, report.Description ?? "");
            cmd.Parameters.AddWithValue("@severity", NpgsqlDbType.Text, report.Severity ?? "");
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, report.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeleteReport(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM ProblemReports WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
