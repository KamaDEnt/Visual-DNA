using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioMensagem(ContextoBancoDados db) : IRepositorioMensagem
{
    public async Task<IReadOnlyList<MensagemServico>> ListarPorServicoAsync(Guid idServico)
        => await db.MensagensServico
            .Include(mensagem => mensagem.Remetente)
            .Where(mensagem => mensagem.ServicoId == idServico)
            .OrderBy(mensagem => mensagem.CriadoEm)
            .ToListAsync();

    public async Task<MensagemServico> AdicionarAsync(MensagemServico mensagem)
    {
        db.MensagensServico.Add(mensagem);
        await db.SaveChangesAsync();
        return mensagem;
    }
}
