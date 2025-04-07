using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class PlantRepository : BaseRepository
    {
        public PlantRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public Plant? GetPlantById(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Plants WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new Plant(Convert.ToInt32(data["id"]))
                {
                    Name = data["name"].ToString(),
                    Nickname = data["nickname"].ToString(),
                    Species = Convert.ToInt32(data["species"]),
                    ImageUrl = data["imageurl"].ToString(),
                    DateAdded = Convert.ToDateTime(data["dateadded"]),
                    UserId = Convert.ToInt32(data["userid"])
                };
            }

            return null;
        }

        public List<Plant> GetAllPlants()
        {
            var plants = new List<Plant>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Plants";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                plants.Add(new Plant(Convert.ToInt32(data["id"]))
                {
                    Name = data["name"].ToString(),
                    Nickname = data["nickname"].ToString(),
                    Species = Convert.ToInt32(data["species"]),
                    ImageUrl = data["imageurl"].ToString(),
                    DateAdded = Convert.ToDateTime(data["dateadded"]),
                    UserId = Convert.ToInt32(data["userid"])
                });
            }

            return plants;
        }

        public bool InsertPlant(Plant plant)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Plants (name, nickname, species, imageurl, dateadded, userid)
                VALUES (@name, @nickname, @species, @imageurl, @dateadded, @userid)";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, plant.Name ?? "");
            cmd.Parameters.AddWithValue("@nickname", NpgsqlDbType.Text, plant.Nickname ?? "");
            cmd.Parameters.AddWithValue("@species", NpgsqlDbType.Integer, plant.Species);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, plant.ImageUrl ?? "");
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);

            return InsertData(dbConn, cmd);
        }

        public bool UpdatePlant(Plant plant)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Plants SET
                    name = @name,
                    nickname = @nickname,
                    species = @species,
                    imageurl = @imageurl,
                    dateadded = @dateadded,
                    userid = @userid
                WHERE id = @id";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, plant.Name ?? "");
            cmd.Parameters.AddWithValue("@nickname", NpgsqlDbType.Text, plant.Nickname ?? "");
            cmd.Parameters.AddWithValue("@species", NpgsqlDbType.Integer, plant.Species);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, plant.ImageUrl ?? "");
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, plant.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeletePlant(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM Plants WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
