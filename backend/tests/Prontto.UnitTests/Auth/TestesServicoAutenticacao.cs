using FluentAssertions;
using Moq;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.UnitTests.Auth;

public class TestesServicoAutenticacao
{
    private readonly Mock<IRepositorioUsuario> _repositorioUsuarios = new();
    private readonly Mock<IServicoJwt> _jwt = new();
    private readonly Mock<IHashSenha> _hashSenha = new();
    private readonly ServicoAutenticacao _sut;

    public TestesServicoAutenticacao()
    {
        _sut = new ServicoAutenticacao(_repositorioUsuarios.Object, _jwt.Object, _hashSenha.Object);
    }

    [Fact]
    public async Task CadastrarAsync_EmailNovo_RetornaTokenEUsuario()
    {
        var comando = new ComandoCadastro("Ana", "ana@test.com", "senha123", TipoConta.Cliente);
        _repositorioUsuarios.Setup(r => r.ObterPorEmailAsync("ana@test.com")).ReturnsAsync((Usuario?)null);
        _hashSenha.Setup(h => h.Hashear("senha123")).Returns("hash");
        _repositorioUsuarios.Setup(r => r.AdicionarAsync(It.IsAny<Usuario>())).ReturnsAsync((Usuario u) => u);
        _jwt.Setup(j => j.GerarToken(It.IsAny<Usuario>())).Returns("jwt-token");

        var resultado = await _sut.CadastrarAsync(comando);

        resultado.Token.Should().Be("jwt-token");
        resultado.Usuario.Email.Should().Be("ana@test.com");
        resultado.Usuario.HashSenha.Should().Be("hash");
    }

    [Fact]
    public async Task CadastrarAsync_EmailDuplicado_LancaExcecaoConflito()
    {
        var comando = new ComandoCadastro("Ana", "ana@test.com", "senha123", TipoConta.Cliente);
        _repositorioUsuarios.Setup(r => r.ObterPorEmailAsync("ana@test.com"))
              .ReturnsAsync(new Usuario { Email = "ana@test.com" });

        await _sut.Invoking(s => s.CadastrarAsync(comando))
            .Should().ThrowAsync<ExcecaoConflito>()
            .WithMessage("E-mail já cadastrado");
    }

    [Fact]
    public async Task EntrarAsync_CredenciaisValidas_RetornaToken()
    {
        var usuario = new Usuario { Id = Guid.NewGuid(), Email = "ana@test.com", HashSenha = "hash" };
        _repositorioUsuarios.Setup(r => r.ObterPorEmailAsync("ana@test.com")).ReturnsAsync(usuario);
        _hashSenha.Setup(h => h.Verificar("senha123", "hash")).Returns(true);
        _jwt.Setup(j => j.GerarToken(usuario)).Returns("jwt-token");

        var resultado = await _sut.EntrarAsync(new ComandoLogin("ana@test.com", "senha123"));

        resultado.Token.Should().Be("jwt-token");
    }

    [Fact]
    public async Task EntrarAsync_SenhaErrada_LancaExcecaoNaoAutorizado()
    {
        var usuario = new Usuario { Email = "ana@test.com", HashSenha = "hash" };
        _repositorioUsuarios.Setup(r => r.ObterPorEmailAsync("ana@test.com")).ReturnsAsync(usuario);
        _hashSenha.Setup(h => h.Verificar("errada", "hash")).Returns(false);

        await _sut.Invoking(s => s.EntrarAsync(new ComandoLogin("ana@test.com", "errada")))
            .Should().ThrowAsync<ExcecaoNaoAutorizado>();
    }

    [Fact]
    public async Task EntrarAsync_EmailDesconhecido_LancaExcecaoNaoAutorizado()
    {
        _repositorioUsuarios.Setup(r => r.ObterPorEmailAsync(It.IsAny<string>())).ReturnsAsync((Usuario?)null);

        await _sut.Invoking(s => s.EntrarAsync(new ComandoLogin("x@x.com", "q")))
            .Should().ThrowAsync<ExcecaoNaoAutorizado>();
    }
}
