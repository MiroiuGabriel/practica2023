using Stagiu.Business.Domain;

namespace Stagiu.Business.Contracts
{
    public interface ICategoryRepository
    {
        int Create(string name, string description);
        PaginatedItems<Category> GetAll(CategoryFilter filter);
        Category? GetById(int id);
        bool Delete(int id);
        bool Update(CategoryUpdateFilter filter);
    }
}
