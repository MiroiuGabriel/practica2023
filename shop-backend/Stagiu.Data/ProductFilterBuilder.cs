using Stagiu.Business.Domain;
using System.Dynamic;

namespace Stagiu.Data
{
    public class ProductFilterBuilder
    {
        private readonly ProductFilter _filter;
        private readonly List<string> _query;
        private readonly dynamic _params;
        public ProductFilterBuilder(ProductFilter filter)
        {
            _filter = filter;
            _query = new List<string>();
            _params = new ExpandoObject();
        }

        public ProductFilterBuilder AddBudget()
        {
            if (_filter.Budget is null) return this;

            _query.Add("Price < @budget");
            _params.budget = _filter.Budget;
            return this;
        }

        public ProductFilterBuilder AddPagination()
        {
            _query.Add("OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY");
            _params.offset = _filter.Offset;
            _params.limit = _filter.Limit;

            return this;
        }

        public ProductFilterBuilder AddSort()
        {
            if (_filter.Sort is not null && (_filter.Sort.ToUpper() != "ASC" && _filter.Sort.ToUpper() != "DESC")) _filter.Sort = "ASC";
            _query.Add($"ORDER by Price {_filter.Sort?.ToUpper() ?? "ASC"}");

            return this;
        }

        public ProductFilterBuilder AddSearch()
        {
            if(_filter.Search is null) return this;

            _query.Add($"LOWER(Name) LIKE '%{_filter.Search}%'");

            return this;
        }
        public ProductFilterBuilder AddCategory()
        {
            if (_filter.CategoryId is null) return this;

            _query.Add("CategoryId = @categoryId");
            _params.categoryId = _filter.CategoryId;

            return this;
        }

        public (string, object) Build()
        {
            var slicedQueries = _query.SkipLast(2).ToList();
            string query = "";
            if (_query[^1] is not null) query += $"{_query[^1]}";
            if (_query.Count > 1 && _query[^2] is not null) query = $" {_query[^2]} {query}";
            query = string.Join(" AND ", slicedQueries) + query;

            if (query.Contains("OFFSET") && query.Contains("ORDER") && _query.Count > 2) query = $" WHERE {query}";

            return (query, _params);
        }

    }
}
