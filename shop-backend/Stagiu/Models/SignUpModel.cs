using System.ComponentModel.DataAnnotations;

namespace Stagiu.Models
{
    public class SignUpModel
    {
        [Required, MinLength(4, ErrorMessage = "Username is too short")]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;

        [MinLength(4, ErrorMessage = "Password is too short")]
        public string Password { get; set; } = string.Empty;
    }
}
