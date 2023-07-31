using Dapper;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IConnectionString _connectionString;
        public UserRepository(IConnectionString connectionString)
        {
            _connectionString = connectionString;
        }

        public bool Create(User user)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "INSERT INTO [User] (Email, Username, [Password], [Role]) VALUES (@email, @username, @password, @role)";

            var affectedRows = db.Connection.Execute(sql, new { email = user.Email, username = user.Username, password = user.Password, role = user.Role });

            return affectedRows == 1;
        }

        public User? GetUser(string email)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "SELECT Email, Username, [Password], [Role] FROM [User] WHERE Email = @email";

            var user = db.Connection.QuerySingleOrDefault<User>(sql, new { email });

            return user;
        }

        public bool UserExists(string email)
        {
            var user = GetUser(email);

            return user is not null;
        }
    }
}
