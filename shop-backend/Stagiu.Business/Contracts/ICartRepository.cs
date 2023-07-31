using Stagiu.Business.Domain;

namespace Stagiu.Data.Repositories
{
    public interface ICartRepository
    {
        bool AddToCart(int cartId, int productId);
        int CreateCart(string userId);
        int DecrementQuantity(int cartId, int productId);
        List<CartItem> GetCart(int cartId);
        int GetCartId(string userId);
        int IncrementQuantity(int cartId, int productId);
        bool RemoveFromCart(int cartId, int productId);
        public int IsInCart(int cartId, int productId);
    }
}