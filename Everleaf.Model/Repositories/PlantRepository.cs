using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

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
                Console.WriteLine($"Found plant: {plant.Name} (ID: {plant.Id}, Species: {plant.Species})");
                return plant;
            }

            Console.WriteLine($"No plant found with ID: {id}");
            return null;
        }

        public List<Plant> GetAllPlants()
        {
            Console.WriteLine("Getting all plants");
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
                Console.WriteLine($"Found plant: {plant.Name} (ID: {plant.Id}, Species: {plant.Species}, SpeciesName: {data["species_name"]})");
                plants.Add(plant);
            }

            Console.WriteLine($"Total plants found: {plants.Count}");
            return plants;
        }

        public List<Plant> GetPlantsByUserId(int userId)
        {
            Console.WriteLine($"Getting plants for user ID: {userId}");
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
                Console.WriteLine($"Found plant: {plant.Name} (ID: {plant.Id}, Species: {plant.Species}, SpeciesName: {data["species_name"]})");
                plants.Add(plant);
            }

            Console.WriteLine($"Total plants found for user {userId}: {plants.Count}");
            return plants;
        }

        public bool InsertPlant(Plant plant)
        {
            Console.WriteLine($"Inserting new plant: {plant.Name} (Species: {plant.Species})");
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Plant (name, nickname, species, imageurl, dateadded, userid)
                VALUES (@name, @nickname, @species, @imageurl, @dateadded, @userid)";

            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, plant.Name ?? "");
            cmd.Parameters.AddWithValue("@nickname", NpgsqlDbType.Text, plant.Nickname ?? "");
            cmd.Parameters.AddWithValue("@species", NpgsqlDbType.Integer, plant.Species);
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);

            var result = InsertData(dbConn, cmd);
            Console.WriteLine($"Plant insert result: {result}");
            return result;
        }

        public bool UpdatePlant(Plant plant)
        {
            Console.WriteLine($"Updating plant ID {plant.Id}: {plant.Name} (Species: {plant.Species})");
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Plant SET
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
            cmd.Parameters.AddWithValue("@dateadded", NpgsqlDbType.Timestamp, plant.DateAdded);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, plant.UserId);
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, plant.Id);

            var result = UpdateData(dbConn, cmd);
            Console.WriteLine($"Plant update result: {result}");
            return result;
        }

        public bool DeletePlant(int id)
        {
            Console.WriteLine($"Deleting plant with ID: {id}");
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM Plant WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var result = DeleteData(dbConn, cmd);
            Console.WriteLine($"Plant delete result: {result}");
            return result;
        }
    }
}
