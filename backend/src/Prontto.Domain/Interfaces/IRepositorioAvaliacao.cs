using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioAvaliacao
{
    Task AdicionarAsync(Avaliacao avaliacao);
    Task<bool> ExisteAvaliacaoAsync(Guid servicoId, Guid avaliadorId);
    Task<(IEnumerable<Avaliacao> Items, int Total)> ListarPorAvaliadoAsync(Guid avaliadoId, int page, int pageSize);
    Task<IEnumerable<Avaliacao>> ListarPorServicoAsync(Guid servicoId);
    Task<(decimal Media, int Total)> CalcularMediaAsync(Guid avaliadoId);
}
