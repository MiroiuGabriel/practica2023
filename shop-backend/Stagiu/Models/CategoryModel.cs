using Stagiu.Business.Domain;

namespace Stagiu.Models
{
    public class CategoryModel
    {
        public CategoryModel(Category entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Description = entity.Description;
        }
        public CategoryModel() { }

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
