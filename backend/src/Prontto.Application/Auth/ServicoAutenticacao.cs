using Prontto.Domain.Entities;
using Prontto.Domain.Interfaces;
using Prontto.Application.Common;

namespace Prontto.Application.Auth;

public class ServicoAutenticacao(
    IRepositorioUsuario repositorioUsuarios,
    IServicoJwt jwt,
    IHashSenha hashSenha) : IServicoAutenticacao
{
    public async Task<ResultadoAutenticacao> CadastrarAsync(ComandoCadastro comando)
    {
        if (await repositorioUsuarios.ObterPorEmailAsync(comando.Email.ToLowerInvariant()) is not null)
            throw new ExcecaoConflito("E-mail já cadastrado");

        var novoUsuario = new Usuario
        {
            Nome = comando.Nome.Trim(),
            Email = comando.Email.ToLowerInvariant().Trim(),
            Telefone = comando.Telefone?.Trim(),
            HashSenha = hashSenha.Hashear(comando.Senha),
            TipoConta = comando.TipoConta,
            Especialidade = comando.Especialidade?.Trim(),
            Cidade = comando.Cidade?.Trim(),
        };

        var usuarioCriado = await repositorioUsuarios.AdicionarAsync(novoUsuario);
        return new ResultadoAutenticacao(jwt.GerarToken(usuarioCriado), usuarioCriado);
    }

    public async Task<ResultadoAutenticacao> EntrarAsync(ComandoLogin comando)
    {
        var usuario = await repositorioUsuarios.ObterPorEmailAsync(comando.Email.ToLowerInvariant().Trim())
            ?? throw new ExcecaoNaoAutorizado("E-mail ou senha incorretos");

        if (!hashSenha.Verificar(comando.Senha, usuario.HashSenha))
            throw new ExcecaoNaoAutorizado("E-mail ou senha incorretos");

        return new ResultadoAutenticacao(jwt.GerarToken(usuario), usuario);
    }

    public async Task<Usuario> ObterUsuarioAtualAsync(Guid idUsuario)
        => await repositorioUsuarios.ObterPorIdAsync(idUsuario)
            ?? throw new ExcecaoNaoEncontrado("Usuário não encontrado");
}
