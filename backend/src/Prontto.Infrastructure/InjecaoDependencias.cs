using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Prontto.Application.Admin;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Data;
using Prontto.Infrastructure.Repositories;
using Prontto.Infrastructure.Services;

namespace Prontto.Infrastructure;

public static class InjecaoDependencias
{
    public static IServiceCollection AdicionarInfraestrutura(
        this IServiceCollection servicos, IConfiguration configuracao)
    {
        servicos.AddDbContext<ContextoBancoDados>(opt =>
            opt.UseNpgsql(configuracao.GetConnectionString("Default")));

        servicos.AddScoped<IRepositorioUsuario, RepositorioUsuario>();
        servicos.AddScoped<IRepositorioServico, RepositorioServico>();
        servicos.AddScoped<IRepositorioCobranca, RepositorioCobranca>();
        servicos.AddScoped<IRepositorioBanking, RepositorioBanking>();
        servicos.AddScoped<IRepositorioMensagem, RepositorioMensagem>();

        servicos.AddScoped<IHashSenha, HashSenhaBcrypt>();
        servicos.AddScoped<IServicoJwt, ServicoJwt>();
        servicos.AddScoped<IServicoAutenticacao, ServicoAutenticacao>();
        servicos.AddScoped<IServicoAdmin, ServicoAdmin>();

        return servicos;
    }
}
