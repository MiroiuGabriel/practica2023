using Stagiu.Business.Domain;

namespace Stagiu.Business.Contracts
{
    public interface IJwtRepository
    {
        int AddRefreshToken(RefreshToken token);
        RefreshToken? GetSavedRefreshToken(string token);
        bool DeleteRefreshToken(string token);
    }
}
