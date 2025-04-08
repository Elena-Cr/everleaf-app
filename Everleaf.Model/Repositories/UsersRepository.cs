using Everleaf.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;

namespace Everleaf.Model.Repositories
{
    public class UserRepository : BaseRepository
    {
        public UserRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public Users? GetUserById(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Users WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new Users(Convert.ToInt32(data["id"]))
                {
                    Username = data["username"].ToString(),
                    PasswordHash = data["passwordhash"].ToString(),
                    Email = data["email"].ToString()
                };
            }

            return null;
        }

        public Users? GetUserByUsername(string username)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Users WHERE username = @username";
            cmd.Parameters.AddWithValue("@username", NpgsqlDbType.Text, username);

            var data = GetData(dbConn, cmd);
            if (data != null && data.Read())
            {
                return new Users(Convert.ToInt32(data["id"]))
                {
                    Username = data["username"].ToString(),
                    PasswordHash = data["passwordhash"].ToString(),
                    Email = data["email"].ToString()
                };
            }

            return null;
        }

        public List<Users> GetAllUsers()
        {
            var users = new List<Users>();
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "SELECT * FROM Users";

            var data = GetData(dbConn, cmd);
            while (data.Read())
            {
                users.Add(new Users(Convert.ToInt32(data["id"]))
                {
                    Username = data["username"].ToString(),
                    PasswordHash = data["passwordhash"].ToString(),
                    Email = data["email"].ToString()
                });
            }

            return users;
        }

        public bool InsertUser(Users user)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Users (username, passwordhash, email)
                VALUES (@username, @passwordhash, @email)";

            cmd.Parameters.AddWithValue("@username", NpgsqlDbType.Text, user.Username ?? "");
            cmd.Parameters.AddWithValue("@passwordhash", NpgsqlDbType.Text, user.PasswordHash ?? "");
            cmd.Parameters.AddWithValue("@email", NpgsqlDbType.Text, user.Email ?? "");

            return InsertData(dbConn, cmd);
        }

        public bool UpdateUser(Users user)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Users SET
                    username = @username,
                    passwordhash = @passwordhash,
                    email = @email
                WHERE id = @id";

            cmd.Parameters.AddWithValue("@username", NpgsqlDbType.Text, user.Username ?? "");
            cmd.Parameters.AddWithValue("@passwordhash", NpgsqlDbType.Text, user.PasswordHash ?? "");
            cmd.Parameters.AddWithValue("@email", NpgsqlDbType.Text, user.Email ?? "");
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, user.Id);

            return UpdateData(dbConn, cmd);
        }

        public bool DeleteUser(int id)
        {
            using var dbConn = new NpgsqlConnection(ConnectionString);
            var cmd = dbConn.CreateCommand();
            cmd.CommandText = "DELETE FROM Users WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, id);

            return DeleteData(dbConn, cmd);
        }
    }
}
