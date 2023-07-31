
namespace Stagiu.Models
{
    public class ProductFilterModel
    {
        public int Offset { get; set; }
        public int Limit { get; set; } = 100;
        public int? CategoryId { get; set; }
        public int? Budget { get; set; }
        public string? Sort { get; set; }
        public string? Search { get; set; }
    }
}
