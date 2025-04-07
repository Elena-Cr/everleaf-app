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
                cmd.CommandText = "SELECT * FROM CareLogs WHERE id = @id";
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
                cmd.CommandText = "SELECT * FROM CareLogs";

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

        public bool InsertCareLog(CareLog log)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO CareLogs (plantid, date, type)
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
                UPDATE CareLogs
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
            cmd.CommandText = "DELETE FROM CareLogs WHERE id = @id";
            _ = cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}