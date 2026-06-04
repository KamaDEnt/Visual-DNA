using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class ControladorAuth(IServicoAutenticacao servicoAuth, IRepositorioBanking banking) : ControllerBase
{
    private const string NomeCookieRefreshToken = "prontto_refresh_token";

    [HttpPost("register")]
    [EnableRateLimiting("cadastro")]
    public async Task<IActionResult> Cadastrar([FromBody] RequisicaoCadastro req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!Enum.TryParse<TipoConta>(req.TipoConta, ignoreCase: true, out var tipoConta))
            return BadRequest(new { error = "Tipo de conta inválido" });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var resultado = await servicoAuth.CadastrarAsync(new ComandoCadastro(
            req.Nome, req.Email, req.Senha, tipoConta,
            req.Telefone, req.Especialidade, req.CidadeId,
            ip, userAgent));

        DefinirCookieRefreshToken(resultado.RefreshToken);

        return StatusCode(201, new { token = resultado.Token, user = DtoUsuario.De(resultado.Usuario) });
    }

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Entrar([FromBody] RequisicaoLogin req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var resultado = await servicoAuth.EntrarAsync(new ComandoLogin(req.Email, req.Senha, ip, userAgent));

        DefinirCookieRefreshToken(resultado.RefreshToken);

        return Ok(new { token = resultado.Token, user = DtoUsuario.De(resultado.Usuario) });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Renovar()
    {
        var tokenBruto = Request.Cookies[NomeCookieRefreshToken];
        if (string.IsNullOrEmpty(tokenBruto))
            return Unauthorized(new { error = "Refresh token ausente" });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var resultado = await servicoAuth.RenovarSessaoAsync(tokenBruto, ip, userAgent);

        DefinirCookieRefreshToken(resultado.RefreshToken);

        return Ok(new { token = resultado.Token, user = DtoUsuario.De(resultado.Usuario) });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var tokenBruto = Request.Cookies[NomeCookieRefreshToken];
        if (!string.IsNullOrEmpty(tokenBruto))
            await servicoAuth.LogoutAsync(tokenBruto);

        RemoverCookieRefreshToken();

        return Ok(new { message = "Logout realizado com sucesso" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> ObterPerfil()
    {
        var idUsuario = Guid.Parse(User.FindFirstValue("userId")!);
        var usuario = await servicoAuth.ObterUsuarioAtualAsync(idUsuario);
        return Ok(new { user = DtoUsuario.De(usuario) });
    }

    [HttpGet("banking")]
    [Authorize]
    public async Task<IActionResult> ObterDadosBancarios()
    {
        var idUsuario = Guid.Parse(User.FindFirstValue("userId")!);
        var dados = await banking.ObterPorUsuarioIdAsync(idUsuario);
        return Ok(new { banking = dados });
    }

    [HttpPost("banking")]
    [Authorize]
    public async Task<IActionResult> SalvarDadosBancarios([FromBody] RequisicaoBanking req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var tipoConta = User.FindFirstValue("accountType");
        var papel = User.FindFirstValue(ClaimTypes.Role);
        if (tipoConta != "prestador" && papel != "admin")
            return StatusCode(403, new { error = "Apenas prestadores podem cadastrar dados bancários" });

        if (!Enum.TryParse<TipoChavePix>(req.TipoChavePix, ignoreCase: true, out var tipoChavePix))
            return BadRequest(new { error = "Tipo de chave Pix inválido" });

        var idUsuario = Guid.Parse(User.FindFirstValue("userId")!);
        var resultado = await banking.SalvarAsync(new Prontto.Domain.Entities.DadosBancarios
        {
            UsuarioId = idUsuario,
            TipoChavePix = tipoChavePix,
            ChavePix = req.ChavePix.Trim(),
            NomeCompleto = req.NomeCompleto.Trim(),
            CpfCnpj = req.CpfCnpj.Trim(),
            NomeBanco = req.NomeBanco?.Trim(),
            Agencia = req.Agencia?.Trim(),
            NumeroConta = req.NumeroConta?.Trim(),
            TipoConta = req.TipoConta,
        });

        return Ok(new { banking = resultado });
    }

    // ── Helpers de cookie ──────────────────────────────────────────────────────

    private void DefinirCookieRefreshToken(string tokenBruto)
    {
        var opcoes = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(30),
            Path = "/api/auth",
        };
        Response.Cookies.Append(NomeCookieRefreshToken, tokenBruto, opcoes);
    }

    private void RemoverCookieRefreshToken()
    {
        Response.Cookies.Delete(NomeCookieRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth",
        });
    }
}

public record RequisicaoCadastro(
    string Nome, string Email, string Senha, string TipoConta,
    string? Telefone = null, string? Especialidade = null, Guid? CidadeId = null);

public record RequisicaoLogin(string Email, string Senha);

public record RequisicaoBanking(
    string TipoChavePix, string ChavePix, string NomeCompleto, string CpfCnpj,
    string? NomeBanco = null, string? Agencia = null,
    string? NumeroConta = null, string? TipoConta = null);
