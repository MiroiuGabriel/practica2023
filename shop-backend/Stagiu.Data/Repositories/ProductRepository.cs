using Dapper;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IConnectionString _connectionString;
        public ProductRepository(IConnectionString connectionString)
        {
            _connectionString = connectionString;
        }

        public PaginatedItems<Product> GetProducts(ProductFilter filter)
        {
            using var db = new SqlDataContext(_connectionString);

            (string sql, object parameters) query = new ProductFilterBuilder(filter).AddSearch().AddBudget().AddCategory().AddSort().AddPagination().Build();
            var totalSql = $"SELECT COUNT(0) FROM Product {query.sql.Substring(0, query.sql.IndexOf("ORDER"))}";

            var total = db.Connection.ExecuteScalar<int>(totalSql, query.parameters);

            var sql = "SELECT Id, Name, [Description], Image, Price, CategoryId FROM Product" + query.sql;

            var products = db.Connection.Query<Product>(sql, query.parameters).ToList();

            return new PaginatedItems<Product> { Total = total, Items = products, Limit = filter.Limit, Offset = filter.Offset };
        }

        public Product? GetById(int id)
        {
            using var db = new SqlDataContext(_connectionString);

            var sql = "SELECT Id, Name, [Description], Image, Price, CategoryId FROM Product WHERE Id = @id";

            var products = db.Connection.QuerySingleOrDefault<Product?>(sql, new { id });

            return products;
        }

        public int Create(Product product)
        {
            using var db = new SqlDataContext(_connectionString);
            var sql = "INSERT INTO Product (Name, [Description], Image, Price, CategoryId) OUTPUT INSERTED.[Id] VALUES (@name, @description, @image, @price, @categoryId)";

            var id = db.Connection.QuerySingle<int>(sql, new { name = product.Name, description = product.Description, image = product.Image, categoryId = product.CategoryId, price = product.Price });

            return id;
        }

        public bool Delete(int id)
        {
            using var db = new SqlDataContext(_connectionString);
            var sql = "DELETE FROM Product WHERE Id = @id";

            int affectedRows = db.Connection.Execute(sql, new { id });

            return affectedRows == 1;
        }

        public bool Update(ProductUpdateFilter filter)
        {
            using var db = new SqlDataContext(_connectionString);
            (string sql, object parameters) query = new ProductUpdateBuilder(filter).WithDescription().WithPrice().WithCategory().WithName().WithImage().Build();

            if (query.sql == " WHERE Id = @id") return false;

            var sql = "UPDATE Product SET " + query.sql;

            int affectedRows = db.Connection.Execute(sql, query.parameters);

            return affectedRows == 1;
        }

    }
}
