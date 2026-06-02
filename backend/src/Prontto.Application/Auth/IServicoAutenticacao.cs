using Prontto.Domain.Entities;

namespace Prontto.Application.Auth;

public interface IServicoAutenticacao
{
    Task<ResultadoAutenticacao> CadastrarAsync(ComandoCadastro comando);
    Task<ResultadoAutenticacao> EntrarAsync(ComandoLogin comando);
    Task<Usuario> ObterUsuarioAtualAsync(Guid idUsuario);
}
