using System.Security.Claims;

namespace Stagiu.Auth
{
    public interface IJwtUtils
    {
        string GenerateToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        string? GetClaimFromJwt(string claimName);
    }
}
