using Everleaf.Model.Entities;

namespace Everleaf.Model.Repositories
{
    public interface IUserRepository
    {
        Users? GetUserById(int id);
        Users? GetUserByUsername(string username);
        List<Users> GetAllUsers();
        bool InsertUser(Users user);
        bool UpdateUser(Users user);
        bool DeleteUser(int id);
    }
}
