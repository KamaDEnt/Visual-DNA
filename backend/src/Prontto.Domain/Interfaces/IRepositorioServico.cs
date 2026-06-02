using Prontto.Domain.Entities;
using Prontto.Domain.Enums;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioServico
{
    Task<Servico?> ObterPorIdAsync(Guid id);
    Task<IReadOnlyList<Servico>> ListarTodosAsync();
    Task<int> ContarPorStatusAsync(StatusServico status);
    Task<int> ContarTodosAsync();
    Task<Servico> AdicionarAsync(Servico servico);
    Task<Servico> AtualizarAsync(Servico servico);
}
