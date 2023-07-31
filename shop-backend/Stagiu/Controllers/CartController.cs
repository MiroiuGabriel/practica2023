using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stagiu.Business.Contracts;
using Stagiu.Data.Repositories;
using Stagiu.Models;

namespace Stagiu.Controllers
{
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartController(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        [HttpGet("/api/cart"), Authorize]
        public ActionResult<List<CartItemModel>> GetCart()
        {
            var cartId = GetCartIdFromUser();
            var items = _cartRepository.GetCart(cartId);

            var cart = items.Select(x => new CartItemModel(x)).ToList();

            return Ok(cart);
        }

        [HttpPost("/api/cart/sync"), Authorize]
        public ActionResult<List<CartItemModel>> SyncCart(List<CartItemModel> items)
        {
            var cartId = GetCartIdFromUser();

            var itemsInCart = _cartRepository.GetCart(cartId);

            items.ForEach(x =>
            {
                int quantity = x.Quantity;

                while (quantity > 0)
                {
                    if (_cartRepository.IsInCart(cartId, x.Id) >= 1)
                    {
                        _cartRepository.IncrementQuantity(cartId, x.Id);
                    }
                    else _cartRepository.AddToCart(cartId, x.Id);
                    quantity--;
                }
            });

            return Ok();
        }


        [HttpPost("/api/cart"), Authorize]
        public ActionResult<CartItemModel> AddToCart(AddToCartModel model)
        {
            var cartId = GetCartIdFromUser();

            var product = _productRepository.GetById(model.ProductId);

            if (product is null) return BadRequest("Product doesn't exist");

            if (_cartRepository.IsInCart(cartId, model.ProductId) >= 1)
            {
                int quantity = _cartRepository.IncrementQuantity(cartId, model.ProductId);

                return Ok(new CartItemModel
                {
                    Quantity = quantity,
                    Description = product.Description,
                    Id = model.ProductId,
                    Image = product.Image,
                    Name = product.Name,
                    Price = product.Price,
                });
            }

            var added = _cartRepository.AddToCart(cartId, model.ProductId);

            if (!added) return BadRequest("Something went wrong. Please try again later!");

            return Ok(new CartItemModel
            {
                Quantity = 1,
                Description = product.Description,
                Id = model.ProductId,
                Image = product.Image,
                Name = product.Name,
                Price = product.Price,
            });
        }

        [HttpDelete("/api/cart/{productId}"), Authorize]
        public ActionResult<CartItemModel?> RemoveFromCart(int productId)
        {
            var cartId = GetCartIdFromUser();

            var product = _productRepository.GetById(productId);

            if (product is null) return BadRequest("Product doesn't exist");

            if (_cartRepository.IsInCart(cartId, productId) > 1)
            {
                int quantity = _cartRepository.DecrementQuantity(cartId, productId);

                return Ok(new CartItemModel
                {
                    Quantity = quantity,
                    Description = product.Description,
                    Id = product.Id,
                    Image = product.Image,
                    Name = product.Name,
                    Price = product.Price,
                });
            }

            var removed = _cartRepository.RemoveFromCart(cartId, productId);

            if (!removed) return BadRequest("Something went wrong. Please try again later!");

            return Ok(null);
        }

        private int GetCartIdFromUser()
        {
            return int.Parse(User.Claims.FirstOrDefault(x => x.Type == "CartId")!.Value);
        }
    }
}
