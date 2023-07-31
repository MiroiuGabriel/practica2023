using Stagiu.Business.Domain;

namespace Stagiu.Models
{
    public class ProductModel
    {
        public ProductModel(Product product)
        {
            Id = product.Id;
            Name = product.Name;
            Description = product.Description;
            Image = product.Image;
            CategoryId = product.CategoryId;
            Price = product.Price;
        }
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
}
