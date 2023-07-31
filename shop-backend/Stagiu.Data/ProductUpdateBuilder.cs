using Stagiu.Business.Domain;
using System.Dynamic;

namespace Stagiu.Data
{
    public class ProductUpdateBuilder
    {
        private readonly ProductUpdateFilter _filter;
        private readonly List<string> _query;
        private readonly dynamic _params;

        public ProductUpdateBuilder(ProductUpdateFilter filter)
        {
            _query = new List<string>();
            _params = new ExpandoObject();
            _filter = filter;
        }

        public ProductUpdateBuilder WithName()
        {
            if (_filter.Name is null) return this;

            _query.Add("Name = @name");
            _params.name = _filter.Name;

            return this;
        }

        public ProductUpdateBuilder WithPrice()
        {
            if (_filter.Price is null) return this;

            _query.Add("Price = @price");
            _params.price = _filter.Price;

            return this;
        }

        public ProductUpdateBuilder WithImage()
        {
            if (_filter.Image is null) return this;

            _query.Add("Image = @image");
            _params.image = _filter.Image;

            return this;
        }

        public ProductUpdateBuilder WithCategory()
        {
            if (_filter.CategoryId is null) return this;

            _query.Add("CategoryId = @categoryId");
            _params.categoryId = _filter.CategoryId;

            return this;
        }

        public ProductUpdateBuilder WithDescription()
        {
            if (_filter.Description is null) return this;

            _query.Add("Description = @description");
            _params.description = _filter.Description;

            return this;
        }

        public (string, object) Build()
        {
            _params.id = _filter.Id;
            return (string.Join(" , ", _query) + " WHERE Id = @id", _params);
        }

    }
}
