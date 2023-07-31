
namespace Stagiu.Business.Domain
{
    public class PaginatedItems<T>
    {
        public int Offset { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public List<T> Items { get; set; } = new List<T>();
    }
}
