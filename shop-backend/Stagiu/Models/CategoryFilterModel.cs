namespace Stagiu.Models
{
    public class CategoryFilterModel
    {
        public int Offset { get; set; }
        public int Limit { get; set; } = 100;
        public string? Sort { get; set; }
        public string? Search { get; set; }
    }
}
