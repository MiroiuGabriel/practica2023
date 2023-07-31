
namespace Stagiu.Business.Domain
{
    public class CategoryFilter
    {
        public int Offset { get; set; }
        public int Limit { get; set; } = 100;
        public string? Sort { get; set; }
        public string? Search { get; set; }
    }

}
