using Prontto.Domain.Entities;

namespace Prontto.Application.Auth;

public record ResultadoAutenticacao(string Token, Usuario Usuario);
