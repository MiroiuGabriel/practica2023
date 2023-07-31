using Dapper;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public class JwtRepository : IJwtRepository
    {
        private readonly IConnectionString _connectionString;

        public JwtRepository(IConnectionString connectionString)
        {
            _connectionString = connectionString;
        }

        public int AddRefreshToken(RefreshToken token)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "INSERT INTO RefreshToken (Token, UserAgent, ExpiresAt, IssuedAt) OUTPUT INSERTED.[Id] VALUES (@token, @userAgent, @expiresAt, @issuedAt)";

            var id = db.Connection.QuerySingle<int>(sql, new { token = token.Token, userAgent = token.UserAgent, expiresAt = token.ExpiresAt, issuedAt = token.IssuedAt });

            return id;
        }

        public bool DeleteRefreshToken(string token)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "DELETE FROM RefreshToken WHERE Token = @token";

            int affectedRows = db.Connection.Execute(sql, new { token });

            return affectedRows == 1;
        }

        public RefreshToken? GetSavedRefreshToken(string token)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "SELECT Token, UserAgent, ExpiresAt, IssuedAt FROM RefreshToken WHERE Token = @token";

            var refreshToken = db.Connection.QuerySingleOrDefault<RefreshToken>(sql, new { token });

            return refreshToken;
        }
    }
}
