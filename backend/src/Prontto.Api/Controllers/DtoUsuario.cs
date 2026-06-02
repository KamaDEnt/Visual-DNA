using Prontto.Domain.Entities;

namespace Prontto.Api.Controllers;

public record DtoUsuario(
    Guid Id, string Nome, string Email, string? Telefone,
    string TipoConta, string Papel,
    string? Especialidade, string? Cidade, DateTime CriadoEm)
{
    public static DtoUsuario De(Usuario u) => new(
        u.Id, u.Nome, u.Email, u.Telefone,
        u.TipoConta.ToString().ToLower(), u.Papel.ToString().ToLower(),
        u.Especialidade, u.Cidade, u.CriadoEm);
}
