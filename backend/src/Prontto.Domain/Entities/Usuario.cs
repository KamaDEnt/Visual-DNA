using Prontto.Domain.Enums;

namespace Prontto.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string HashSenha { get; set; } = string.Empty;
    public TipoConta TipoConta { get; set; }
    public Papel Papel { get; set; } = Papel.Usuario;
    public string? Especialidade { get; set; }
    public string? Cidade { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

    public DadosBancarios? DadosBancarios { get; set; }
    public ICollection<Servico> ServicosComoCliente { get; set; } = [];
    public ICollection<Servico> ServicosComoPrestador { get; set; } = [];
    public ICollection<MensagemServico> Mensagens { get; set; } = [];
}
