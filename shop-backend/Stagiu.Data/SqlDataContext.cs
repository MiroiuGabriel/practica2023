using Dapper;
using Microsoft.Data.SqlClient;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;

namespace Stagiu.Data
{
    public class SqlDataContext : IDisposable
    {
        public SqlConnection Connection { get; }
        public SqlDataContext(IConnectionString connectionString)
        {
            Connection = new SqlConnection(connectionString.SqlConnectionString);
        }
        public void Dispose()
        {
            if (Connection is null)
            {
                return;
            }

            Connection.Close();
            Connection.Dispose();
        }

        public async Task Init()
        {
            var db = Connection;

            var userSql = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='User' and xtype='U') 
                CREATE TABLE [User] (
                Email VARCHAR(250) NOT NULL PRIMARY KEY,
                Username VARCHAR(150) NOT NULL,
                Password VARCHAR(MAX) NOT NULL,
                Role VARCHAR(150) NOT NULL
            )
             ";

            var refreshTokenSql = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RefreshToken' and xtype='U')
                CREATE TABLE [RefreshToken] (
                Id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
                Token VARCHAR(MAX) NOT NULL,
                UserAgent VARCHAR(MAX) NOT NULL,
                ExpiresAt DATE NOT NULL,
                IssuedAt DATE NOT NULL
            )
            ";

            var categorySql = @"
                 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Category' and xtype='U')
                 CREATE TABLE [Category] (
                 Id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
                 Name NVARCHAR(150),
                 Description NVARCHAR(150)
            )
        ";

            var productSql = @"
                  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Product' and xtype='U')
                  CREATE TABLE [Product] (
                  Id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
                  Name VARCHAR(150),
                  Description VARCHAR(MAX),
                  Image VARCHAR(MAX),
                  CategoryId INT,
                  Price MONEY,
                  FOREIGN KEY (CategoryId) REFERENCES Category(Id)
            )
";

            var cartSql = @" 
                 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart' and xtype='U')
                 CREATE TABLE [Cart] (
                 Id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
                 UserId VARCHAR(250),   
                 Total DECIMAL(18,0) NOT NULL
            )
        ";

            var cartItemSql = @"
                 IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CartItem' and xtype='U')
                 CREATE TABLE [CartItem] (
                 Id INTEGER NOT NULL IDENTITY(1,1) PRIMARY KEY,
                 CartId INT,   
                 ProductId INT,
                 Quantity INT,
                 FOREIGN KEY (CartId) REFERENCES Cart(Id),        
                 FOREIGN KEY (ProductId) REFERENCES Product(Id)
            )";

            await db.ExecuteAsync(userSql);
            await db.ExecuteAsync(refreshTokenSql);
            await db.ExecuteAsync(categorySql);
            await db.ExecuteAsync(productSql);
            await db.ExecuteAsync(cartSql);
            await db.ExecuteAsync(cartItemSql);

            await SeedDatabase();
        }

        private async Task SeedDatabase()
        {
            var ProductList = new List<Product>() {
                new Product()
                {
                    Name = "Lenovo XPerion 212",
                    Description = "Gaming Laptop",
                    Image = "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
                    CategoryId = 1,
                    Price = 1240.00m
                },
                 new Product()
                {
                    Name = "HP GShock 1F1B",
                    Description = "Best laptop by HP",
                    Image = "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06227428.png",
                    CategoryId = 1,
                    Price = 969.99m
                },
                  new Product()
                {
                    Name = "Samsung Galaxy A51",
                    Description = "Newest device on the market",
                    Image = "https://p1.akcdn.net/full/663442326.samsung-galaxy-a51-64gb-4gb-ram-dual.jpg",
                    CategoryId = 2,
                    Price = 249.69m
                },
                   new Product()
                {
                    Name = "BYYBUO SmartPad A10_L Tablet 10.1 inch Android 11",
                    Description = "Preferential price, multi-function, fast Internet access, reading, watching movies, games, music, study,",
                    Image = "https://m.media-amazon.com/images/I/71CZ14Ul0dL._AC_SX466_.jpg",
                    CategoryId = 3,
                    Price = 59.95m
                }, new Product()
                {
                    Name = "Apple iPad Air 2, 64 GB, Space Gray",
                    Description = "The product is refurbished, fully functional, and in excellent condition. Backed by the 90-day Amazon Renewed Guarantee.",
                    Image = "https://m.media-amazon.com/images/I/71AfLgrG19L._AC_SX466_.jpg",
                    CategoryId = 3,
                    Price = 140.00m
                }, new Product()
                {
                    Name = "Srhythm NC25 Wireless Headphones Bluetooth 5.3,",
                    Description = "Digital Active Noise Cancelling Technology. Press the ANC button, and it will offer a pure immersive world for you whether wired or Bluetooth. ",
                    Image = "https://m.media-amazon.com/images/I/61wbr2lSdJL._AC_SX466_.jpg",
                    CategoryId = 4,
                    Price = 69.99m
                }

            };
            var CategoriesList = new List<Category>() { new Category {
                Id = 1,
                Name = "Laptop",
                Description = "Best laptops by brands curated by us"
            }, new Category {
                Id = 2,
                Name="Smartphone",
                Description = "Best smartphones on the market"
            }, new Category(){
                Id =3,
                 Name = "Tablet",
                 Description="Tablets are useful devices for gaming and browsing the web"
            }, new Category(){Id = 4,
                 Name = "Headphones",
                 Description = "Empower yourself with great music"} };


            var db = Connection;

            var adminSql = "INSERT INTO [User] (Email, Username, Password, Role) VALUES ('admin@gmail.com', 'Administrator', '$2a$11$fYNdaTbm3xobi7J/2KH9WehzkWV/mNIdGC9zMmnld7BsjwXTT5JX2', 'admin')";

            var productCountSql = $"SELECT COUNT(0) FROM Product";
            var categoryCountSql = $"SELECT COUNT(0) FROM Category";
            var usersCountSql = $"SELECT COUNT(0) FROM [User]";
            var cartSql = "INSERT INTO Cart (UserId, Total) VALUES ('admin@gmail.com', 0)";

            var productCount = db.ExecuteScalar<int>(productCountSql);
            var categoryCount = db.ExecuteScalar<int>(categoryCountSql);
            var usersCount = db.ExecuteScalar<int>(usersCountSql);

            if (usersCount == 0) {
                await db.ExecuteAsync(adminSql);
                await db.ExecuteAsync(cartSql);
            };


            if (categoryCount == 0)
                foreach (var category in CategoriesList)
                {
                    var sql = "INSERT INTO Category (Name, [Description]) VALUES (@name, @description)";
                    await db.ExecuteAsync(sql, new { name = category.Name, description = category.Description });
                }

            if (productCount == 0)
                foreach (var product in ProductList)
                {
                    var sql = "INSERT INTO Product (Name, [Description], Image, Price, CategoryId) VALUES (@name, @description, @image, @price, @categoryId)";
                    await db.ExecuteAsync(sql, new { name = product.Name, description = product.Description, image = product.Image, categoryId = product.CategoryId, price = product.Price });
                }
        }
    }
}
