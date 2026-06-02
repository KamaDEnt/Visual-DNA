using Prontto.Domain.Enums;

namespace Prontto.Domain.Entities;

public class MensagemServico
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServicoId { get; set; }
    public Guid? RemetenteId { get; set; }
    public PapelRemetente PapelRemetente { get; set; }
    public string Conteudo { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Servico Servico { get; set; } = null!;
    public Usuario? Remetente { get; set; }
}
