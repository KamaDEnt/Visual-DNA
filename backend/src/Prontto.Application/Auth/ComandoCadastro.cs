using Prontto.Domain.Enums;

namespace Prontto.Application.Auth;

public record ComandoCadastro(
    string Nome,
    string Email,
    string Senha,
    TipoConta TipoConta,
    string? Telefone = null,
    string? Especialidade = null,
    string? Cidade = null
);
