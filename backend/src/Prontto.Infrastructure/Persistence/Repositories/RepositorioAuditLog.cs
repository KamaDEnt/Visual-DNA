using Prontto.Domain.Entities;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioAuditLog(ContextoBancoDados db) : IRepositorioAuditLog
{
    public async Task RegistrarAsync(AuditLog log)
    {
        db.LogsAuditoria.Add(log);
        await db.SaveChangesAsync();
    }
}
