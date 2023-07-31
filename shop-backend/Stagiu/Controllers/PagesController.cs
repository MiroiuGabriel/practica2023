using Microsoft.AspNetCore.Mvc;
using Stagiu.Auth;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;
using Stagiu.Models;
using System.Security.Claims;

namespace Stagiu.Controllers
{
    [ApiController]
    public class PagesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProductRepository _productRepository;
        private readonly IJwtUtils _utils;

        public PagesController(ICategoryRepository categoryRepository, IProductRepository productRepository, IJwtUtils utils)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
            _utils = utils;
        }

        [HttpGet("/api/pages")]
        public ActionResult<PagesModel> GetPages()
        {
            var identity = User.Identity;

            var categoryIds = _categoryRepository.GetAll(new CategoryFilter { Limit = 9999 }).Items.Select(x => x.Id);
            var productIds = _productRepository.GetProducts(new ProductFilter { Limit = 9999 }).Items.Select(x => x.Id);

            var categoryPages = categoryIds.Select(id => new PageModel { Route = $"/categories/{id}/products" }).ToList();
            var updateCategoryPages = categoryIds.Select(id => new PageModel { Route = $"/admin/categories/create/{id}" }).ToList();
            var updateProductPages = productIds.Select(id => new PageModel { Route = $"/admin/products/create/{id}" }).ToList();

            bool isAdmin = _utils.GetClaimFromJwt(ClaimTypes.Role) == "admin";

            if (isAdmin)
            {
                var other = new List<PageModel>()
                {   
                    new PageModel {Route = "/admin/categories"}, new PageModel {Route = "/admin/categories/create"},
                    new PageModel {Route = "/admin/products"}, new PageModel {Route = "/admin/products/create"},
                    new PageModel {Route = "/"}
                };

                other.AddRange(categoryPages);
                other.AddRange(updateCategoryPages);
                other.AddRange(updateProductPages);

                return Ok(new PagesModel
                {
                    SidebarPages = new List<PageModel>() { new PageModel { Name = "Home", Route = "/" },
                    new PageModel { Name = "Categories", Route = "/admin/categories" },
                    new PageModel { Name = "Products", Route = "/admin/products" } },
                    Other = other
                }
                );
            }

            var routes = new List<PageModel>()
                    {
                        new PageModel { Route = "/" },
                        new PageModel { Route = "/auth/sign-in" },
                        new PageModel { Route = "/auth/sign-up" }
                    };

            routes.AddRange(categoryPages);

            return Ok(new PagesModel
            {
                SidebarPages = new List<PageModel>() { new PageModel { Name = "Home", Route = "/" } },
                Other = routes
            });

        }

    }
}
