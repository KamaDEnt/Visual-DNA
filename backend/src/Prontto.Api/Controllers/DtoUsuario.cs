using Prontto.Domain.Entities;

namespace Prontto.Api.Controllers;

public record DtoUsuario(
    Guid Id,
    string Nome,
    string Email,
    string? Telefone,
    string TipoConta,
    string Papel,
    string? Especialidade,
    Guid? CidadeId,
    string? FotoPerfilUrl,
    string? Slug,
    decimal MediaAvaliacoes,
    int TotalAvaliacoes,
    DateTime CriadoEm,
    bool Bloqueado)
{
    public static DtoUsuario De(Usuario u) => new(
        u.Id,
        u.Nome,
        u.Email,
        u.Telefone,
        u.TipoConta.ToString().ToLower(),
        u.Papel.ToString().ToLower(),
        u.Especialidade,
        u.CidadeId,
        u.FotoPerfilUrl,
        u.Slug,
        u.MediaAvaliacoes,
        u.TotalAvaliacoes,
        u.CriadoEm,
        u.DeletadoEm.HasValue);
}
