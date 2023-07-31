using Dapper;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly IConnectionString _connection;

        public CartRepository(IConnectionString connection)
        {
            _connection = connection;
        }

        public List<CartItem> GetCart(int cartId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = @"
                SELECT p.Id, ci.CartId, ci.Quantity, p.Name, p.Description, p.Image, p.Price FROM CartItem ci 
                LEFT JOIN Product p ON ci.ProductId = p.id
                LEFT JOIN Cart c ON ci.CartId = c.Id WHERE c.Id = @cartId;
                      ";

            var cartItems = db.Connection.Query<CartItem>(sql, new { cartId }).ToList();

            return cartItems;
        }

        public int CreateCart(string userId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "INSERT INTO Cart (UserId, Total) OUTPUT INSERTED.[Id] VALUES (@userId, 0)";

            var id = db.Connection.QuerySingle<int>(sql, new { userId });

            return id;
        }

        public int IsInCart(int cartId, int productId) 
        {
            using var db = new SqlDataContext(_connection);

            var sql = "SELECT Quantity FROM CartItem WHERE CartId = @cartId AND ProductId = @productId";

            var quantity = db.Connection.QuerySingleOrDefault<int>(sql, new { cartId, productId });

            return quantity;

        }

        public bool AddToCart(int cartId, int productId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "INSERT INTO CartItem (CartId, ProductId, Quantity) VALUES (@cartId, @productId, 1)";

            var affectedRows = db.Connection.Execute(sql, new { cartId, productId });

            return affectedRows == 1;
        }

        public int GetCartId(string userId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "SELECT Id FROM Cart WHERE UserId = @userId";

            var id = db.Connection.QuerySingle<int>(sql, new { userId });

            return id;
        }

        public bool RemoveFromCart(int cartId, int productId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "DELETE FROM CartItem WHERE CartId = @cartId AND ProductId = @productId";

            var affectedRows = db.Connection.Execute(sql, new { cartId, productId });

            return affectedRows == 1;
        }

        public int IncrementQuantity(int cartId, int productId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "UPDATE CartItem SET Quantity = Quantity + 1 OUTPUT INSERTED.[Quantity] WHERE CartId = @cartId AND ProductId = @productId";

            var quantity = db.Connection.QuerySingle<int>(sql, new { cartId, productId });

            return quantity;
        }

        public int DecrementQuantity(int cartId, int productId)
        {
            using var db = new SqlDataContext(_connection);

            var sql = "UPDATE CartItem SET Quantity = Quantity - 1 OUTPUT INSERTED.[Quantity] WHERE CartId = @cartId AND ProductId = @productId";

            var quantity = db.Connection.QuerySingle<int>(sql, new { cartId, productId });

            return quantity;
        }
    }
}
