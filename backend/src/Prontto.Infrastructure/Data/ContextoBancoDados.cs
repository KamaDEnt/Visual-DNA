using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;

namespace Prontto.Infrastructure.Data;

public class ContextoBancoDados(DbContextOptions<ContextoBancoDados> opcoes) : DbContext(opcoes)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<DadosBancarios> DadosBancarios => Set<DadosBancarios>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<MensagemServico> MensagensServico => Set<MensagemServico>();
    public DbSet<Cobranca> Cobrancas => Set<Cobranca>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(e =>
        {
            e.ToTable("users");
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Nome).HasColumnName("name");
            e.Property(u => u.Email).HasColumnName("email");
            e.Property(u => u.Telefone).HasColumnName("phone");
            e.Property(u => u.HashSenha).HasColumnName("password_hash");
            e.Property(u => u.TipoConta).HasColumnName("account_type").HasConversion<string>();
            e.Property(u => u.Papel).HasColumnName("role").HasConversion<string>();
            e.Property(u => u.Especialidade).HasColumnName("specialty");
            e.Property(u => u.Cidade).HasColumnName("city");
            e.Property(u => u.CriadoEm).HasColumnName("created_at");
            e.Property(u => u.AtualizadoEm).HasColumnName("updated_at");
        });

        modelBuilder.Entity<DadosBancarios>(e =>
        {
            e.ToTable("professional_banking");
            e.Property(b => b.UsuarioId).HasColumnName("user_id");
            e.Property(b => b.TipoChavePix).HasColumnName("pix_key_type").HasConversion<string>();
            e.Property(b => b.ChavePix).HasColumnName("pix_key");
            e.Property(b => b.NomeCompleto).HasColumnName("full_name");
            e.Property(b => b.CpfCnpj).HasColumnName("cpf_cnpj");
            e.Property(b => b.NomeBanco).HasColumnName("bank_name");
            e.Property(b => b.Agencia).HasColumnName("agency");
            e.Property(b => b.NumeroConta).HasColumnName("account_number");
            e.Property(b => b.TipoConta).HasColumnName("bank_account_type");
            e.Property(b => b.CriadoEm).HasColumnName("created_at");
            e.Property(b => b.AtualizadoEm).HasColumnName("updated_at");
            e.HasOne(b => b.Usuario).WithOne(u => u.DadosBancarios)
                .HasForeignKey<DadosBancarios>(b => b.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Servico>(e =>
        {
            e.ToTable("services");
            e.Property(s => s.Titulo).HasColumnName("title");
            e.Property(s => s.Descricao).HasColumnName("description");
            e.Property(s => s.Categoria).HasColumnName("category");
            e.Property(s => s.ClienteId).HasColumnName("client_id");
            e.Property(s => s.PrestadorId).HasColumnName("provider_id");
            e.Property(s => s.Preco).HasColumnName("price").HasPrecision(10, 2);
            e.Property(s => s.TaxaAdminRate).HasColumnName("admin_fee_rate").HasPrecision(5, 4);
            e.Property(s => s.Status).HasColumnName("status").HasConversion<string>();
            e.Property(s => s.Endereco).HasColumnName("address");
            e.Property(s => s.AgendadoEm).HasColumnName("scheduled_at");
            e.Property(s => s.ConcluidoEm).HasColumnName("completed_at");
            e.Property(s => s.CriadoEm).HasColumnName("created_at");
            e.Property(s => s.AtualizadoEm).HasColumnName("updated_at");
            e.HasOne(s => s.Cliente).WithMany(u => u.ServicosComoCliente)
                .HasForeignKey(s => s.ClienteId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(s => s.Prestador).WithMany(u => u.ServicosComoPrestador)
                .HasForeignKey(s => s.PrestadorId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<MensagemServico>(e =>
        {
            e.ToTable("service_messages");
            e.Property(m => m.ServicoId).HasColumnName("service_id");
            e.Property(m => m.RemetenteId).HasColumnName("sender_id");
            e.Property(m => m.PapelRemetente).HasColumnName("sender_role").HasConversion<string>();
            e.Property(m => m.Conteudo).HasColumnName("content");
            e.Property(m => m.CriadoEm).HasColumnName("created_at");
            e.HasOne(m => m.Servico).WithMany(s => s.Mensagens)
                .HasForeignKey(m => m.ServicoId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(m => m.Remetente).WithMany(u => u.Mensagens)
                .HasForeignKey(m => m.RemetenteId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Cobranca>(e =>
        {
            e.ToTable("charges");
            e.Property(c => c.ServicoId).HasColumnName("service_id");
            e.Property(c => c.ValorTotal).HasColumnName("total_amount").HasPrecision(10, 2);
            e.Property(c => c.TaxaAdmin).HasColumnName("admin_fee").HasPrecision(10, 2);
            e.Property(c => c.ValorPrestador).HasColumnName("provider_amount").HasPrecision(10, 2);
            e.Property(c => c.Status).HasColumnName("status").HasConversion<string>();
            e.Property(c => c.PagadoEm).HasColumnName("paid_at");
            e.Property(c => c.CriadoEm).HasColumnName("created_at");
            e.Property(c => c.AtualizadoEm).HasColumnName("updated_at");
            e.HasOne(c => c.Servico).WithOne(s => s.Cobranca)
                .HasForeignKey<Cobranca>(c => c.ServicoId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
