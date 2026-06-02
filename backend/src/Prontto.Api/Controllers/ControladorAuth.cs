using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class ControladorAuth(IServicoAutenticacao servicoAuth, IRepositorioBanking banking) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Cadastrar([FromBody] RequisicaoCadastro req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!Enum.TryParse<TipoConta>(req.TipoConta, ignoreCase: true, out var tipoConta))
            return BadRequest(new { error = "Tipo de conta inválido" });

        var resultado = await servicoAuth.CadastrarAsync(new ComandoCadastro(
            req.Nome, req.Email, req.Senha, tipoConta,
            req.Telefone, req.Especialidade, req.Cidade));

        return StatusCode(201, new { token = resultado.Token, user = DtoUsuario.De(resultado.Usuario) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Entrar([FromBody] RequisicaoLogin req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var resultado = await servicoAuth.EntrarAsync(new ComandoLogin(req.Email, req.Senha));
        return Ok(new { token = resultado.Token, user = DtoUsuario.De(resultado.Usuario) });
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
}

public record RequisicaoCadastro(
    string Nome, string Email, string Senha, string TipoConta,
    string? Telefone = null, string? Especialidade = null, string? Cidade = null);

public record RequisicaoLogin(string Email, string Senha);

public record RequisicaoBanking(
    string TipoChavePix, string ChavePix, string NomeCompleto, string CpfCnpj,
    string? NomeBanco = null, string? Agencia = null,
    string? NumeroConta = null, string? TipoConta = null);
