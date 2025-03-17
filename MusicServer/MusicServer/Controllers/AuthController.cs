using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MusicServer.Core.Classes;
using MusicServer.Core.Dto;
using MusicServer.Core.Iservice;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MusicServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Login/")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel loginModel)
        {
            var user = await _userService.GetUserByEmailAsync(loginModel.Email);
            // Important: In a real application, NEVER store passwords in plain text.
            // Always hash and compare hashed passwords.
            if (user != null && loginModel.Password == user.Password)
            {
                var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name,user.Username ),
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString() ),
                new Claim(ClaimTypes.Role,user.IsAdmin?"manager":"user")
            };

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: _configuration.GetValue<string>("JWT:Issuer"),
                    audience: _configuration.GetValue<string>("JWT:Audience"),
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(6),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString });
            }
            return Unauthorized();
        }

        [HttpPost("register/")]
        public async Task<IActionResult> RegisterUser(UserDto user)
        {
            await _userService.AddUserAsync(new User()
            {
                Email = user.Email,
                Password = user.Password, // Remember to hash passwords in a real app
                RegistrationDate = DateTime.Now,
                Username = user.Username,
                IsAdmin=false
                
            });
            return await LoginAsync(new LoginModel() { Email = user.Email, Password = user.Password });
        }

    }
}
