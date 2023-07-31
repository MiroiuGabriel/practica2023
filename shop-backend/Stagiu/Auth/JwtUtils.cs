using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Stagiu.Auth
{

    public class JwtUtils : IJwtUtils
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContext;

        public JwtUtils(IConfiguration config, IHttpContextAccessor httpContext)
        {
            _config = config;
            _httpContext = httpContext;
        }

        public string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.Now.Add(TimeSpan.FromMinutes(20));

            var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"], claims, expires: expires, signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }
        public string? GetClaimFromJwt(string claimName)
        {
            var ctx = _httpContext.HttpContext!;
            string? jwtEncoded = ctx.Request.Headers.Authorization;

            if (jwtEncoded is null) return null;

            jwtEncoded = jwtEncoded.Replace("Bearer ", "");

            var handler = new JwtSecurityTokenHandler();

            JwtSecurityToken? jwtDecoded = handler.ReadToken(jwtEncoded) as JwtSecurityToken;

            if (jwtDecoded is null) return null;

            var claim = jwtDecoded.Claims.FirstOrDefault(j => j.Type == claimName);

            if (claim is null) return null;

            return claim.Value;
        }

    }
}
