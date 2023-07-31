namespace Stagiu.Models
{
    public class AuthResponse
    {
        public AccessToken AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public UserModel User { get; set; }
    }
}
