using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Data;

namespace Prontto.Infrastructure.Repositories;

public class RepositorioCobranca(ContextoBancoDados db) : IRepositorioCobranca
{
    public async Task<IReadOnlyList<Cobranca>> ListarTodosAsync()
        => await db.Cobrancas
            .Include(cobranca => cobranca.Servico)
            .OrderByDescending(cobranca => cobranca.CriadoEm)
            .ToListAsync();

    public async Task<decimal> SomarTaxaAdminPorStatusAsync(StatusCobranca status)
        => await db.Cobrancas
            .Where(cobranca => cobranca.Status == status)
            .SumAsync(cobranca => (decimal?)cobranca.TaxaAdmin) ?? 0m;

    public async Task<decimal> SomarValorTotalPorStatusAsync(StatusCobranca status)
        => await db.Cobrancas
            .Where(cobranca => cobranca.Status == status)
            .SumAsync(cobranca => (decimal?)cobranca.ValorTotal) ?? 0m;

    public Task<bool> ExistePorServicoAsync(Guid idServico)
        => db.Cobrancas.AnyAsync(cobranca => cobranca.ServicoId == idServico);

    public async Task<Cobranca> AdicionarAsync(Cobranca cobranca)
    {
        db.Cobrancas.Add(cobranca);
        await db.SaveChangesAsync();
        return cobranca;
    }
}
