using Prontto.Domain.Entities;
using Prontto.Domain.Enums;

namespace Prontto.Application.Admin;

public interface IServicoAdmin
{
    Task<EstatisticasAdmin> ObterEstatisticasAsync();
    Task<IReadOnlyList<Usuario>> ListarUsuariosAsync();
    Task<IReadOnlyList<Servico>> ListarServicosAsync();
    Task<Servico> AtualizarStatusServicoAsync(Guid idServico, StatusServico novoStatus);
    Task<IReadOnlyList<MensagemServico>> ListarMensagensServicoAsync(Guid idServico);
    Task<MensagemServico> EnviarMensagemAsync(Guid idServico, Guid idRemetente, string conteudo);
    Task<IReadOnlyList<Cobranca>> ListarCobrancasAsync();
}
