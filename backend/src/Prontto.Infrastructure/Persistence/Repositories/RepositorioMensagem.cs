using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioMensagem(ContextoBancoDados db) : IRepositorioMensagem
{
    public async Task<IReadOnlyList<MensagemServico>> ListarPorServicoAsync(Guid idServico)
        => await db.MensagensServico
            .Include(m => m.Remetente)
            .Where(m => m.ServicoId == idServico)
            .OrderBy(m => m.CriadoEm)
            .ToListAsync();

    public Task<MensagemServico?> ObterPropostaPendenteAsync(Guid servicoId)
        => db.MensagensServico
            .Where(m =>
                m.ServicoId == servicoId &&
                m.TipoMensagem == TipoMensagem.Proposta &&
                m.StatusProposta == StatusProposta.Pendente)
            .OrderByDescending(m => m.CriadoEm)
            .FirstOrDefaultAsync();

    public async Task<MensagemServico> AdicionarAsync(MensagemServico mensagem)
    {
        db.MensagensServico.Add(mensagem);
        await db.SaveChangesAsync();
        return mensagem;
    }

    public async Task AtualizarAsync(MensagemServico mensagem)
    {
        db.MensagensServico.Update(mensagem);
        await db.SaveChangesAsync();
    }
}
