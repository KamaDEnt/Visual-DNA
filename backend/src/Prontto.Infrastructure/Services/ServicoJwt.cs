using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Prontto.Application.Auth;
using Prontto.Domain.Entities;

namespace Prontto.Infrastructure.Services;

public class ServicoJwt(IConfiguration configuracao) : IServicoJwt
{
    public string GerarToken(Usuario usuario)
    {
        var segredo = configuracao["SESSION_SECRET"] ?? "prontto-secret-dev";
        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(segredo));
        var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("userId", usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim("accountType", usuario.TipoConta.ToString().ToLower()),
            new Claim(ClaimTypes.Role, usuario.Papel.ToString().ToLower()),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: credenciais
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
