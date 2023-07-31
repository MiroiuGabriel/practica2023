namespace Stagiu.Models
{
    public class AccessToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public DateTime IssuedAt { get; } = DateTime.Now;
    }
}
