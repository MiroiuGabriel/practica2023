using Stagiu.Business.Domain;

namespace Stagiu.Models
{
    public class CartItemModel
    {
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public string Image { get; set; } = string.Empty;
		public decimal Price { get; set; }
		public int Quantity { get; set; }
        public CartItemModel() { }
        public CartItemModel(CartItem item)
		{
			Id = item.Id;
			Name = item.Name;
			Description = item.Description;
			Image = item.Image;
			Price = item.Price;
			Quantity = item.Quantity;
		}
    }
}
