using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stagiu.Auth;
using Stagiu.Business.Contracts;
using Stagiu.Business.Domain;
using Stagiu.Data.Repositories;
using Stagiu.Models;
using System.Security.Claims;

namespace Stagiu.Controllers
{
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtUtils _utils;
        private readonly ICartRepository _cartRepository;
        private readonly IJwtRepository _jwtRepository;
        private readonly IConfiguration _config;

        public AuthController(IUserRepository userRepository, IJwtRepository jwtRepository, ICartRepository cartRepository, IJwtUtils utils, IConfiguration config)
        {
            _userRepository = userRepository;
            _utils = utils;
            _cartRepository = cartRepository;
            _jwtRepository = jwtRepository;
            _config = config;
        }

        private ActionResult<AuthResponse> SignIn(SignInModel model, string userAgent)
        {
            if (model.Email is null || model.Password is null) return BadRequest("Email or password fields are empty");
            User? user = _userRepository.GetUser(model.Email);

            if (user == null) return BadRequest("User doesn't exist");

            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return Problem("Passwords do not match");
            }

            var cartId = _cartRepository.GetCartId(user.Email);


            var claims = new List<Claim>
                {
                    new Claim("Email", user.Email),
                    new Claim("Username", user.Username),
                    new Claim("CartId",cartId.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                };

            var token = _utils.GenerateToken(claims);
            var refreshToken = IssueRefreshToken(userAgent);

            return Ok(new AuthResponse
            {
                AccessToken = new AccessToken
                {
                    Token = token,
                    Expires = DateTime.Now.Add(TimeSpan.FromMinutes(int.Parse(_config["Jwt:Expires"]!)))

                },
                RefreshToken = refreshToken.Token,
                User = new UserModel
                {
                    Email = user.Email,
                    Username = user.Username
                }
            });
        }

        private ActionResult<AuthResponse> Refresh(SignInModel model, string userAgent)
        {
            if (model.RefreshToken is null) return Ok("Please provide refresh token");

            var email = _utils.GetClaimFromJwt("Email");

            if (email == null) return Forbid("No jwt token provided");

            var refreshToken = _jwtRepository.GetSavedRefreshToken(model.RefreshToken);

            if (refreshToken is null) return Forbid("Invalid refresh token");

            // If expired 
            if (refreshToken.ExpiresAt < DateTime.Now)
            {
                _jwtRepository.DeleteRefreshToken(refreshToken.Token);

                return Forbid("Refresh token is expired");
            }

            // If client changed 
            if (userAgent != refreshToken.UserAgent)
            {
                return Forbid("User agent changed");
            }

            // By refreshing the token we generate new tokens -- source Auth0

            User? user = _userRepository.GetUser(email);

            if (user == null) return Unauthorized("User doesn't exist");

            var cartId = _cartRepository.GetCartId(user.Email);

            var claims = new List<Claim>
                {
                    new Claim("Email", user.Email),
                    new Claim("Username", user.Username),
                    new Claim("CartId", cartId.ToString()),
                    new Claim(ClaimTypes.Role, user.Role),
                };

            _jwtRepository.DeleteRefreshToken(refreshToken.Token);

            var newRefreshToken = IssueRefreshToken(userAgent);
            var token = _utils.GenerateToken(claims);

            return Ok(new AuthResponse
            {
                AccessToken = new AccessToken
                {
                    Token = token,
                    Expires = DateTime.Now.Add(TimeSpan.FromMinutes(int.Parse(_config["Jwt:Expires"]!)))
                },
                RefreshToken = newRefreshToken.Token,
                User = new UserModel
                {
                    Email = user.Email,
                    Username = user.Username
                }
            });
        }

        [HttpPost("api/auth/sign-in")]
        public ActionResult<AuthResponse> SignIn(SignInModel model)
        {
            string userAgent = HttpContext.Request.Headers.UserAgent.ToString();

            if (model.GrantType == GrantType.Credentials)
            {
                return SignIn(model, userAgent);
            }
            else if (model.GrantType == GrantType.Refresh)
            {
                return Refresh(model, userAgent);
            }

            return Ok("Invalid Grant Type");
        }

        [HttpPost("api/auth/sign-up")]
        public ActionResult<AuthResponse> SignUp(SignUpModel model)
        {
            var userExists = _userRepository.UserExists(model.Email);

            if (userExists) return Conflict("An account associated with this email already exists");

            // validate model data

            var password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Email = model.Email,
                Password = password,
                Role = "client",
                Username = model.Username
            };

            var created = _userRepository.Create(user);

            if (!created) return Problem("User could not be created");

            string userAgent = HttpContext.Request.Headers.UserAgent.ToString();

            var refreshToken = IssueRefreshToken(userAgent);

            var cartId = _cartRepository.CreateCart(user.Email);

            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Role, "client"),
                new Claim("Email", user.Email),
                new Claim("Username", user.Username),
                new Claim("CartId", cartId.ToString()),
            };

            var token = _utils.GenerateToken(claims);

            return Ok(new AuthResponse
            {
                AccessToken = new AccessToken
                {
                    Token = token,
                    Expires = DateTime.Now.Add(TimeSpan.FromMinutes(int.Parse(_config["Jwt:Expires"]!)))
                },
                RefreshToken = refreshToken.Token,
                User = new UserModel
                {
                    Email = model.Email,
                    Username = model.Username
                }
            });
        }

        private RefreshToken IssueRefreshToken(string userAgent)
        {

            var genRefreshToken = _utils.GenerateRefreshToken();

            var refreshToken = new RefreshToken { Token = genRefreshToken, UserAgent = userAgent };

            _jwtRepository.AddRefreshToken(refreshToken);

            return refreshToken;
        }
    }
}
