using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;
using Stagiu.Models;
using System.Data;

namespace Stagiu.Controllers
{
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet("/api/products")]
        public PaginatedItemsModel<ProductModel> GetAll([FromQuery] ProductFilterModel filter)
        {
            var model = _productRepository.GetProducts(new ProductFilter { Budget = filter.Budget, CategoryId = filter.CategoryId, Limit = filter.Limit, Offset = filter.Offset, Sort = filter.Sort, Search = filter.Search });

            return new PaginatedItemsModel<ProductModel>
            {
                Items = model.Items.Select(x => new ProductModel(x)).ToList(),
                Limit = model.Limit,
                Offset = model.Offset,
                Total = model.Total
            };
        }

        [HttpGet("/api/products/{id}")]
        public ActionResult<ProductModel> GetById(int id)
        {
            var product = _productRepository.GetById(id);

            if (product is null) return NotFound();

            return new ProductModel(product);
        }

        [HttpPost("/api/products"), Authorize(Roles = "admin")]
        public ActionResult<ProductModel> Create(ProductBodyModel product)
        {
            var newProduct = new Product { CategoryId = product.CategoryId, Description = product.Description, Image = product.Image, Name = product.Name, Price = product.Price };
            int id = _productRepository.Create(newProduct);

            return new ProductModel(newProduct)
            {
                Id = id
            };
        }
        [HttpDelete("/api/products/{id}"), Authorize(Roles = "admin")]
        public ActionResult Delete(int id)
        {
            bool deleted = _productRepository.Delete(id);
            return deleted ? Ok() : NotFound();
        }

        [HttpPut("/api/products/"), Authorize(Roles = "admin")]
        public ActionResult Update(ProductUpdateModel model)
        {
            bool updated = _productRepository.Update(new ProductUpdateFilter { CategoryId = model.CategoryId, Description = model.Description, Id = model.Id, Image = model.Image, Name = model.Name, Price = model.Price });

            return updated ? Ok() : NotFound();
        }
    }
}
