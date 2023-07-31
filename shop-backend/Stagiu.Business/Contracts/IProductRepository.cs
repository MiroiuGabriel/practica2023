using Stagiu.Business.Domain;

namespace Stagiu.Business.Contracts
{
    public interface IProductRepository
    {
        PaginatedItems<Product> GetProducts(ProductFilter filter);
        Product? GetById(int id);
        int Create(Product product);
        public bool Delete(int id);
        public bool Update(ProductUpdateFilter filter);
    }
}
