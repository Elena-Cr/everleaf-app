using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;

namespace Everleaf.Model.Repositories
{
    
    public class PlantRepository : BaseRepository, IPlantRepository
    {
        public PlantRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public Plant? GetPlantById(int id)
        {
            Console.WriteLine($"Getting plant with ID: {id}");
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Plant WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                var plant = new Plant
                {
                    Id = Convert.ToInt32(data["id"]),
                    Name = data["name"].ToString(),
                    Nickname = data["nickname"].ToString(),
                    Species = Convert.ToInt32(data["species"]),
                    DateAdded = Convert.ToDateTime(data["dateadded"]),
                    UserId = Convert.ToInt32(data["userid"])
                };
                return plant;
            }

            return null;
        }

        public List<Plant> GetAllPlants()
        {
            var plants = new List<Plant>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                SELECT p.*, pt.commonname as species_name 
                FROM Plant p 
                LEFT JOIN PlantType pt ON p.species = pt.id";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                var plant = new Plant
                {
                    Id = Convert.ToInt32(data["id"]),
                    Name = data["name"].ToString(),
                    Nickname = data["nickname"].ToString(),
                    Species = Convert.ToInt32(data["species"]),
                    DateAdded = Convert.ToDateTime(data["dateadded"]),
                    UserId = Convert.ToInt32(data["userid"])
                };
                plants.Add(plant);
            }
            return plants;
        }

        public List<Plant> GetPlantsByUserId(int userId)
        {
            var plants = new List<Plant>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                SELECT p.*, pt.commonname as species_name 
                FROM Plant p 
                LEFT JOIN PlantType pt ON p.species = pt.id 
                WHERE p.userid = @userId";
            cmd.Parameters.AddWithValue("@userId", NpgsqlDbType.Integer, userId);

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                var plant = new Plant
                {
                    Id = Convert.ToInt32(data["id"]),
                    Name = data["name"].ToString(),
                    Nickname = data["nickname"].ToString(),
                    Species = Convert.ToInt32(data["species"]),
                    DateAdded = Convert.ToDateTime(data["dateadded"]),
                    UserId = Convert.ToInt32(data["userid"])
                };
                plants.Add(plant);
            }
            return plants;
        }        public bool InsertPlant(Plant plant)
        {
            Console.WriteLine($"Inserting new plant: {plant.Name} (Species: {plant.Species})");
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Plant (name, nickname, species, dateadded, userid)
                VALUES (@name, @nickname, @species, @dateadded, @userid)";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, plant.Name ?? "");
            cmd.Parameters.AddWithValue("@nickname", NpgsqlDbType.Text, plant.Nickname ?? "");
            cmd.Parameters.AddWithValue("@species", NpgsqlDbType.Integer, plant.Species);
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);

            var result = InsertData(dbConn, cmd);
            return result;
        }

        public bool UpdatePlant(Plant plant)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Plant SET
                    name = @name,
                    nickname = @nickname,
                    species = @species,
                    dateadded = @dateadded,
                    userid = @userid
                WHERE id = @id";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, plant.Name ?? "");
            cmd.Parameters.AddWithValue("@nickname", NpgsqlDbType.Text, plant.Nickname ?? "");
            cmd.Parameters.AddWithValue("@species", NpgsqlDbType.Integer, plant.Species);
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, plant.Id);

            var result = UpdateData(dbConn, cmd);
            return result;
        }

        public bool DeletePlant(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM Plant WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var result = DeleteData(dbConn, cmd);
            return result;
        }
    }
}
