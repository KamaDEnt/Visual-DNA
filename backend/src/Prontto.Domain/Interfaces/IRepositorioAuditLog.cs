using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioAuditLog
{
    Task RegistrarAsync(AuditLog log);
}
