using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioNotificacao
{
    Task AdicionarAsync(Notificacao notificacao);
    Task<List<Notificacao>> ListarPorUsuarioAsync(Guid usuarioId, bool apenasNaoLidas = false);
}
