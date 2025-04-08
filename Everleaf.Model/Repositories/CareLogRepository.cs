using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class CareLogRepository(IConfiguration configuration) : BaseRepository(configuration)
    {
        public CareLog GetCareLogById(int id)
        {
            NpgsqlConnection? dbConn = null;
            try
            {
                dbConn = new NpgsqlConnection(ConnectionString);
                var cmd = dbConn.CreateCommand();
                cmd.CommandText = "SELECT * FROM CareLog WHERE id = @id";
                _ = cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

                var data = GetData(dbConn, cmd);
                if (data != null && data.Read())
                {
                    return new CareLog(Convert.ToInt32(data["id"]))
                    {
                        PlantId = Convert.ToInt32(data["plantid"]),
                        Date = Convert.ToDateTime(data["date"]),
                        Type = data["type"].ToString()
                    };
                }
                return null;
            }
            finally
            {
                dbConn?.Close();
            }
        }

        public List<CareLog> GetAllCareLogs()
        {
            var logs = new List<CareLog>();
            NpgsqlConnection? dbConn = null;
            try
            {
                dbConn = new NpgsqlConnection(ConnectionString);
                var cmd = dbConn.CreateCommand();
                cmd.CommandText = "SELECT * FROM CareLog";

                var data = GetData(dbConn, cmd);
                while (data.Read())
                {
                    logs.Add(new CareLog(Convert.ToInt32(data["id"]))
                    {
                        PlantId = Convert.ToInt32(data["plantid"]),
                        Date = Convert.ToDateTime(data["date"]),
                        Type = data["type"].ToString()
                    });
                }
                return logs;
            }
            finally
            {
                dbConn?.Close();
            }
        }

        public List<CareLog> GetLogsByUserId(int userId)
        {
            var logs = new List<CareLog>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();

            cmd.CommandText = @"
                SELECT cl.*
                FROM CareLog cl
                INNER JOIN Plant p ON cl.PlantId = p.Id
                WHERE p.UserId = @userId";

            cmd.Parameters.AddWithValue("@userId", NpgsqlDbType.Integer, userId);

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                logs.Add(new CareLog(Convert.ToInt32(data["id"]))
                {
                    PlantId = Convert.ToInt32(data["plantid"]),
                    Date = Convert.ToDateTime(data["date"]),
                    Type = data["type"].ToString()
                });
            }

            return logs;
        }

        public bool InsertCareLog(CareLog log)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO CareLog (plantid, date, type)
                VALUES (@plantid, @date, @type)";
            _ = cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, log.PlantId);
            _ = cmd.Parameters.AddWithValue("@date", NpgsqlDbType.Date, log.Date);
            _ = cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, log.Type);

            return InsertData(dbConn, cmd);
        }

        public bool UpdateCareLog(CareLog log)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE CareLog
                SET plantid = @plantid, date = @date, type = @type
                WHERE id = @id";
            _ = cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, log.PlantId);
            _ = cmd.Parameters.AddWithValue("@date", NpgsqlDbType.Date, log.Date);
            _ = cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, log.Type);
            _ = cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, log.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeleteCareLog(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM CareLog WHERE id = @id";
            _ = cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
