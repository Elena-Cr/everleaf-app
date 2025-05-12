using Microsoft.Extensions.Configuration;
using Npgsql;

public class BaseRepository(IConfiguration configuration)
{
    protected string ConnectionString { get; } = configuration.GetConnectionString("DefaultConnection");

    protected NpgsqlDataReader GetData(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        conn.Open();
        return cmd.ExecuteReader();
    }

    protected bool InsertData(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        conn.Open();
        _ = cmd.ExecuteNonQuery();
        return true;
    }

    protected bool UpdateData(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        conn.Open();
        _ = cmd.ExecuteNonQuery();
        return true;
    }

    protected bool DeleteData(NpgsqlConnection conn, NpgsqlCommand cmd)
    {
        conn.Open();
        _ = cmd.ExecuteNonQuery();
        return true;
    }
}