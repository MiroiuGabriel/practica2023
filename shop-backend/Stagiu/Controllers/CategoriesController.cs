using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;
using Stagiu.Models;

namespace Stagiu.Controllers
{
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepo)
        {
            _categoryRepository = categoryRepo;
        }

        [HttpGet("api/categories")]
        public PaginatedItems<CategoryModel> GetAll([FromQuery] CategoryFilterModel filter)
        {
            var model = _categoryRepository.GetAll(new CategoryFilter { Limit = filter.Limit, Offset = filter.Offset, Search = filter.Search, Sort = filter.Sort });

            return new PaginatedItems<CategoryModel>
            {
                Total = model.Total,
                Offset = model.Offset,
                Limit = model.Limit,
                Items = model.Items.Select(x => new CategoryModel(x)).ToList()
            };
        }
        [HttpGet("api/categories/{id}")]
        public ActionResult<CategoryModel> GetById(int id)
        {
            var category = _categoryRepository.GetById(id);

            if (category is null) return NotFound();

            return new CategoryModel(category);
        }

        [HttpPost("api/categories"), Authorize(Roles = "admin")]
        public ActionResult<CategoryModel> Create(CategoryBody category)
        {
            int id = _categoryRepository.Create(category.Name, category.Description);
            var entity = new CategoryModel { Description = category.Description, Id = id, Name = category.Name };

            return Created(nameof(Create), entity);
        }
        [HttpDelete("api/categories/{id}"), Authorize(Roles = "admin")]
        public ActionResult Delete(int id)
        {
            bool deleted = _categoryRepository.Delete(id);

            return deleted ? Ok() : NotFound();
        }
        [HttpPut("api/categories"), Authorize(Roles = "admin")]
        public ActionResult Update(CategoryUpdateFilterModel filter)
        {
            bool updated = _categoryRepository.Update(new CategoryUpdateFilter { Description = filter.Description, Name = filter.Name, Id = filter.Id });

            return updated ? Ok() : NotFound();
        }
    }
}
