using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class PlantTypeRepository : BaseRepository
    {
        public PlantTypeRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public PlantType? GetPlantTypeById(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM PlantType WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new PlantType(Convert.ToInt32(data["id"]))
                {
                    CommonName = data["commonname"].ToString(),
                    ScientificName = data["scientificname"].ToString(),
                    WateringFrequencyDays = Convert.ToInt32(data["wateringfrequencydays"]),
                    FertilizingFrequencyDays = Convert.ToInt32(data["fertilizingfrequencydays"]),
                    SunlightNeeds = data["sunlightneeds"].ToString()
                };
            }

            return null;
        }

        public List<PlantType> GetAllPlantType()
        {
            var types = new List<PlantType>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM PlantType";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                types.Add(new PlantType(Convert.ToInt32(data["id"]))
                {
                    CommonName = data["commonname"].ToString(),
                    ScientificName = data["scientificname"].ToString(),
                    WateringFrequencyDays = Convert.ToInt32(data["wateringfrequencydays"]),
                    FertilizingFrequencyDays = Convert.ToInt32(data["fertilizingfrequencydays"]),
                    SunlightNeeds = data["sunlightneeds"].ToString()
                });
            }

            return types;
        }

        public bool InsertPlantType(PlantType pt)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO PlantType (commonname, scientificname, wateringfrequencydays, fertilizingfrequencydays, sunlightneeds)
                VALUES (@commonname, @scientificname, @wateringfrequencydays, @fertilizingfrequencydays, @sunlightneeds)";

            cmd.Parameters.AddWithValue("@commonname", NpgsqlDbType.Text, pt.CommonName ?? "");
            cmd.Parameters.AddWithValue("@scientificname", NpgsqlDbType.Text, pt.ScientificName ?? "");
            cmd.Parameters.AddWithValue("@wateringfrequencydays", NpgsqlDbType.Integer, pt.WateringFrequencyDays);
            cmd.Parameters.AddWithValue("@fertilizingfrequencydays", NpgsqlDbType.Integer, pt.FertilizingFrequencyDays);
            cmd.Parameters.AddWithValue("@sunlightneeds", NpgsqlDbType.Text, pt.SunlightNeeds ?? "");

            return InsertData(dbConn, cmd);
        }

        public bool UpdatePlantType(PlantType pt)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE PlantType SET
                    commonname = @commonname,
                    scientificname = @scientificname,
                    wateringfrequencydays = @wateringfrequencydays,
                    fertilizingfrequencydays = @fertilizingfrequencydays,
                    sunlightneeds = @sunlightneeds
                WHERE id = @id";

            cmd.Parameters.AddWithValue("@commonname", NpgsqlDbType.Text, pt.CommonName ?? "");
            cmd.Parameters.AddWithValue("@scientificname", NpgsqlDbType.Text, pt.ScientificName ?? "");
            cmd.Parameters.AddWithValue("@wateringfrequencydays", NpgsqlDbType.Integer, pt.WateringFrequencyDays);
            cmd.Parameters.AddWithValue("@fertilizingfrequencydays", NpgsqlDbType.Integer, pt.FertilizingFrequencyDays);
            cmd.Parameters.AddWithValue("@sunlightneeds", NpgsqlDbType.Text, pt.SunlightNeeds ?? "");
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, pt.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeletePlantType(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM PlantType WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
