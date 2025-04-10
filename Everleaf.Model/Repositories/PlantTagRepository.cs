using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class PlantTagRepository : BaseRepository
    {
        public PlantTagRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public List<PlantTag> GetAllPlantTag()
        {
            var plantTag = new List<PlantTag>();

            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM PlantTag";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                plantTag.Add(new PlantTag(
                    Convert.ToInt32(data["plantid"]),
                    Convert.ToInt32(data["tagid"])
                ));
            }

            return plantTag;
        }

        public bool InsertPlantTag(PlantTag pt)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO PlantTag (plantid, tagid)
                VALUES (@plantid, @tagid)";

            cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, pt.PlantId);
            cmd.Parameters.AddWithValue("@tagid", NpgsqlDbType.Integer, pt.TagId);

            return InsertData(dbConn, cmd);
        }

        public bool DeletePlantTag(int plantId, int tagId)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                DELETE FROM PlantTag
                WHERE plantid = @plantid AND tagid = @tagid";

            cmd.Parameters.AddWithValue("@plantid", NpgsqlDbType.Integer, plantId);
            cmd.Parameters.AddWithValue("@tagid", NpgsqlDbType.Integer, tagId);

            return DeleteData(dbConn, cmd);
        }
    }
}
