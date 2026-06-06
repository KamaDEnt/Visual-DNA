using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioNotificacao(ContextoBancoDados db) : IRepositorioNotificacao
{
    public async Task AdicionarAsync(Notificacao notificacao)
    {
        db.Notificacoes.Add(notificacao);
        await db.SaveChangesAsync();
    }

    public async Task<List<Notificacao>> ListarPorUsuarioAsync(Guid usuarioId, bool apenasNaoLidas = false)
    {
        var query = db.Notificacoes
            .Where(n => n.UsuarioId == usuarioId);

        if (apenasNaoLidas)
            query = query.Where(n => !n.Lida);

        return await query
            .OrderByDescending(n => n.CriadoEm)
            .Take(50)
            .ToListAsync();
    }
}
