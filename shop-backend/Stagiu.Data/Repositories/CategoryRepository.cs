using Dapper;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IConnectionString _connectionString;
        public CategoryRepository(IConnectionString connectionString)
        {
            _connectionString = connectionString;
        }

        public bool Update(CategoryUpdateFilter filter)
        {
            using var db = new SqlDataContext(_connectionString);

            (string sql, object parameters) query = new CategoryUpdateBuilder(filter).WithDescription().WithName().Build();

            if (query.sql == " WHERE Id = @id") return false;

            var sql = "UPDATE Category SET " + query.sql;


            int affectedRows = db.Connection.Execute(sql, query.parameters);

            return affectedRows == 1;
        }

        public bool Delete(int id)
        {
            using var db = new SqlDataContext(_connectionString);
            var sql = "DELETE FROM Category WHERE Id = @id";

            int affectedRows = db.Connection.Execute(sql, new { id });

            return affectedRows == 1;
        }

        public int Create(string name, string description)
        {
            using var db = new SqlDataContext(_connectionString);
            var sql = "INSERT INTO Category (Name, [Description]) OUTPUT INSERTED.[Id] VALUES (@name, @description)";
            int id = db.Connection.QuerySingle<int>(sql, new { name, description });
            return id;
        }

        public PaginatedItems<Category> GetAll(CategoryFilter filter)
        {
            using var db = new SqlDataContext(_connectionString);

            (string sql, object parameters) query = new CategoryFilterBuilder(filter).AddSearch().AddSort().AddPagination().Build();

            var totalSql = $"SELECT COUNT(0) FROM Category {query.sql.Substring(0, query.sql.IndexOf("ORDER"))}";

            var total = db.Connection.ExecuteScalar<int>(totalSql, query.parameters);

            var sql = "SELECT Id, Name, [Description] FROM Category" + query.sql;

            var categories = db.Connection.Query<Category>(sql, query.parameters).ToList();

            return new PaginatedItems<Category> { Items = categories, Limit = filter.Limit, Offset = filter.Offset, Total = total };

        }

        public Category? GetById(int id)
        {
            using var db = new SqlDataContext(_connectionString);
            var sql = "SELECT Id, Name, [Description] FROM Category WHERE Id = @id";
            return db.Connection.QueryFirstOrDefault<Category>(sql, new { id });
        }
    }
}
