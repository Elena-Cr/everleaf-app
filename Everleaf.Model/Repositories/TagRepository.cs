using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class TagRepository : BaseRepository
    {
        public TagRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public Tag? GetTagById(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Tags WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new Tag(Convert.ToInt32(data["id"]))
                {
                    Name = data["name"].ToString()
                };
            }

            return null;
        }

        public List<Tag> GetAllTags()
        {
            var tags = new List<Tag>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Tags";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                tags.Add(new Tag(Convert.ToInt32(data["id"]))
                {
                    Name = data["name"].ToString()
                });
            }

            return tags;
        }

        public bool InsertTag(Tag tag)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "INSERT INTO Tags (name) VALUES (@name)";
            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, tag.Name ?? "");

            return InsertData(dbConn, cmd);
        }

        public bool UpdateTag(Tag tag)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "UPDATE Tags SET name = @name WHERE id = @id";
            cmd.Parameters.AddWithValue("@name", NpgsqlDbType.Text, tag.Name ?? "");
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, tag.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeleteTag(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM Tags WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
