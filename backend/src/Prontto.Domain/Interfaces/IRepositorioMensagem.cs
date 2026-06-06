using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioMensagem
{
    Task<IReadOnlyList<MensagemServico>> ListarPorServicoAsync(Guid idServico);
    Task<MensagemServico?> ObterPropostaPendenteAsync(Guid servicoId);
    Task<MensagemServico> AdicionarAsync(MensagemServico mensagem);
    Task AtualizarAsync(MensagemServico mensagem);
}
