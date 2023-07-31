using Stagiu.Business.Domain;

namespace Stagiu.Business.Contracts
{
    public interface IUserRepository
    {
        User? GetUser(string email);
        bool Create(User user);
        bool UserExists(string email);
    }
}
