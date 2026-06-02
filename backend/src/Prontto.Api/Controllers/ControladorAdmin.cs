using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prontto.Application.Admin;
using Prontto.Domain.Enums;

namespace Prontto.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class ControladorAdmin(IServicoAdmin admin) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> Estatisticas() => Ok(await admin.ObterEstatisticasAsync());

    [HttpGet("users")]
    public async Task<IActionResult> Usuarios()
    {
        var usuarios = await admin.ListarUsuariosAsync();
        return Ok(new { users = usuarios.Select(DtoUsuario.De) });
    }

    [HttpGet("services")]
    public async Task<IActionResult> Servicos()
    {
        var servicos = await admin.ListarServicosAsync();
        return Ok(new { services = servicos });
    }

    [HttpPatch("services/{id:guid}")]
    public async Task<IActionResult> AtualizarStatusServico(Guid id, [FromBody] RequisicaoStatus req)
    {
        if (!Enum.TryParse<StatusServico>(req.Status, ignoreCase: true, out var status))
            return BadRequest(new { error = "Status inválido" });

        var servico = await admin.AtualizarStatusServicoAsync(id, status);
        return Ok(new { service = servico });
    }

    [HttpGet("services/{id:guid}/messages")]
    public async Task<IActionResult> ListarMensagens(Guid id)
    {
        var mensagens = await admin.ListarMensagensServicoAsync(id);
        return Ok(new { messages = mensagens });
    }

    [HttpPost("services/{id:guid}/messages")]
    public async Task<IActionResult> EnviarMensagem(Guid id, [FromBody] RequisicaoMensagem req)
    {
        var idRemetente = Guid.Parse(User.FindFirstValue("userId")!);
        var mensagem = await admin.EnviarMensagemAsync(id, idRemetente, req.Conteudo);
        return StatusCode(201, new { message = mensagem });
    }

    [HttpGet("charges")]
    public async Task<IActionResult> Cobrancas()
    {
        var cobrancas = await admin.ListarCobrancasAsync();
        return Ok(new { charges = cobrancas });
    }
}

public record RequisicaoStatus(string Status);
public record RequisicaoMensagem(string Conteudo);
