
namespace Stagiu.Models
{
    public static class GrantType
    {
        public static readonly string Credentials = "credentials";
        public static readonly string Refresh = "refresh";
    }
    public class SignInModel
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string GrantType { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
    }

}
