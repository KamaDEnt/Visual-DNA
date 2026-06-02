using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioUsuario
{
    Task<Usuario?> ObterPorIdAsync(Guid id);
    Task<Usuario?> ObterPorEmailAsync(string email);
    Task<IReadOnlyList<Usuario>> ListarNaoAdminsAsync();
    Task<Usuario> AdicionarAsync(Usuario usuario);
    Task<Usuario> AtualizarAsync(Usuario usuario);
}
