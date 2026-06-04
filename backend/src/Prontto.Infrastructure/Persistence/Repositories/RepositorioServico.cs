using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioServico(ContextoBancoDados db) : IRepositorioServico
{
    public Task<Servico?> ObterPorIdAsync(Guid id)
        => db.Servicos
            .Include(servico => servico.Cliente)
            .Include(servico => servico.Prestador)
            .FirstOrDefaultAsync(servico => servico.Id == id);

    public async Task<IReadOnlyList<Servico>> ListarTodosAsync()
        => await db.Servicos
            .Include(servico => servico.Cliente)
            .Include(servico => servico.Prestador)
            .OrderByDescending(servico => servico.CriadoEm)
            .ToListAsync();

    public Task<int> ContarPorStatusAsync(StatusServico status)
        => db.Servicos.CountAsync(servico => servico.Status == status);

    public Task<int> ContarTodosAsync()
        => db.Servicos.CountAsync();

    public async Task<Servico> AdicionarAsync(Servico servico)
    {
        db.Servicos.Add(servico);
        await db.SaveChangesAsync();
        return servico;
    }

    public async Task<Servico> AtualizarAsync(Servico servico)
    {
        db.Servicos.Update(servico);
        await db.SaveChangesAsync();
        return servico;
    }
}
