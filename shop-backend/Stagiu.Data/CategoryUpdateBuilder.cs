using Stagiu.Business.Domain;
using System.Dynamic;

namespace Stagiu.Data
{
    public class CategoryUpdateBuilder
    {
        private readonly CategoryUpdateFilter _filter;
        private readonly List<string> _query;
        private readonly dynamic _params;

        public CategoryUpdateBuilder(CategoryUpdateFilter filter)
        {
            _query = new List<string>();
            _params = new ExpandoObject();
            _filter = filter;
        }

        public CategoryUpdateBuilder WithName()
        {
            if (_filter.Name is null) return this;

            _query.Add("Name = @name");
            _params.name = _filter.Name;

            return this;
        }
        public CategoryUpdateBuilder WithDescription()
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
