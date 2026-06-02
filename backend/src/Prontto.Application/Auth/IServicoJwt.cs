using Prontto.Domain.Entities;

namespace Prontto.Application.Auth;

public interface IServicoJwt
{
    string GerarToken(Usuario usuario);
}
