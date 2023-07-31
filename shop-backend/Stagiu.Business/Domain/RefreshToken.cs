namespace Stagiu.Business.Domain
{
    public class RefreshToken
    {
        public string Token { get; set; }
        public string UserAgent { get; set; }
        public DateTime ExpiresAt { get; set; } = DateTime.Now.Add(TimeSpan.FromDays(7));
        public DateTime IssuedAt { get; set; } = DateTime.Now;
    }
}
