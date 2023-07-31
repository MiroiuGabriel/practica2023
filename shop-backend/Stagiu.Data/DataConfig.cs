using Microsoft.Extensions.DependencyInjection;
using Stagiu.Business.Contracts;
using Stagiu.Data.Repositories;

namespace Stagiu.Data
{
    public static class DataConfig
    {
        public static void ApplyDataServices(this IServiceCollection services)
        {
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IJwtRepository, JwtRepository>();
            services.AddTransient<ICartRepository, CartRepository>();
        }
    }
}
