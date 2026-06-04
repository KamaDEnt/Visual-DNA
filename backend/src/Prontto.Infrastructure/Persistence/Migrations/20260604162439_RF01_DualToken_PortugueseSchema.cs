using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Prontto.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RF01_DualToken_PortugueseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    telefone = table.Column<string>(type: "text", nullable: true),
                    hash_senha = table.Column<string>(type: "text", nullable: false),
                    tipo_conta = table.Column<string>(type: "text", nullable: false),
                    papel = table.Column<string>(type: "text", nullable: false),
                    especialidade = table.Column<string>(type: "text", nullable: true),
                    cidade_id = table.Column<Guid>(type: "uuid", nullable: true),
                    cpf = table.Column<string>(type: "text", nullable: true),
                    url_foto_perfil = table.Column<string>(type: "text", nullable: true),
                    slug = table.Column<string>(type: "text", nullable: true),
                    descricao = table.Column<string>(type: "text", nullable: true),
                    media_avaliacoes = table.Column<decimal>(type: "numeric(3,2)", precision: 3, scale: 2, nullable: false),
                    total_avaliacoes = table.Column<int>(type: "integer", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deletado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "dados_bancarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo_chave_pix = table.Column<string>(type: "text", nullable: false),
                    chave_pix = table.Column<string>(type: "text", nullable: false),
                    nome_completo = table.Column<string>(type: "text", nullable: false),
                    cpf_cnpj = table.Column<string>(type: "text", nullable: false),
                    nome_banco = table.Column<string>(type: "text", nullable: true),
                    agencia = table.Column<string>(type: "text", nullable: true),
                    numero_conta = table.Column<string>(type: "text", nullable: true),
                    tipo_conta = table.Column<string>(type: "text", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dados_bancarios", x => x.id);
                    table.ForeignKey(
                        name: "FK_dados_bancarios_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "servicos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: true),
                    categoria = table.Column<string>(type: "text", nullable: false),
                    cliente_id = table.Column<Guid>(type: "uuid", nullable: true),
                    prestador_id = table.Column<Guid>(type: "uuid", nullable: true),
                    preco = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    taxa_admin_percentual = table.Column<decimal>(type: "numeric(5,4)", precision: 5, scale: 4, nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    endereco = table.Column<string>(type: "text", nullable: true),
                    agendado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    concluido_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    aguardando_confirmacao_desde = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deletado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_servicos", x => x.id);
                    table.ForeignKey(
                        name: "FK_servicos_usuarios_cliente_id",
                        column: x => x.cliente_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_servicos_usuarios_prestador_id",
                        column: x => x.prestador_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "tokens_renovacao",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token = table.Column<string>(type: "text", nullable: false),
                    expira_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    revogado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    substituido_por = table.Column<string>(type: "text", nullable: true),
                    endereco_ip = table.Column<string>(type: "text", nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tokens_renovacao", x => x.id);
                    table.ForeignKey(
                        name: "FK_tokens_renovacao_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cobrancas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    servico_id = table.Column<Guid>(type: "uuid", nullable: false),
                    valor_total = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    taxa_admin = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    valor_prestador = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    pagarme_order_id = table.Column<string>(type: "text", nullable: true),
                    pagarme_payment_id = table.Column<string>(type: "text", nullable: true),
                    pix_qr_code = table.Column<string>(type: "text", nullable: true),
                    pix_copia_cola = table.Column<string>(type: "text", nullable: true),
                    pix_expira_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    pago_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    retido_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    liberado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    atualizado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cobrancas", x => x.id);
                    table.ForeignKey(
                        name: "FK_cobrancas_servicos_servico_id",
                        column: x => x.servico_id,
                        principalTable: "servicos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "mensagens_servico",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    servico_id = table.Column<Guid>(type: "uuid", nullable: false),
                    remetente_id = table.Column<Guid>(type: "uuid", nullable: true),
                    papel_remetente = table.Column<string>(type: "text", nullable: false),
                    tipo_mensagem = table.Column<string>(type: "text", nullable: false),
                    conteudo = table.Column<string>(type: "text", nullable: false),
                    valor_proposta = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    status_proposta = table.Column<string>(type: "text", nullable: true),
                    imagem_moderada = table.Column<bool>(type: "boolean", nullable: false),
                    imagem_aprovada = table.Column<bool>(type: "boolean", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mensagens_servico", x => x.id);
                    table.ForeignKey(
                        name: "FK_mensagens_servico_servicos_servico_id",
                        column: x => x.servico_id,
                        principalTable: "servicos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_mensagens_servico_usuarios_remetente_id",
                        column: x => x.remetente_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_cobrancas_pagarme_order_id",
                table: "cobrancas",
                column: "pagarme_order_id",
                unique: true,
                filter: "pagarme_order_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_cobrancas_servico_id",
                table: "cobrancas",
                column: "servico_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_cobrancas_status_pix_expira_em",
                table: "cobrancas",
                columns: new[] { "status", "pix_expira_em" });

            migrationBuilder.CreateIndex(
                name: "IX_dados_bancarios_usuario_id",
                table: "dados_bancarios",
                column: "usuario_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_servico_remetente_id",
                table: "mensagens_servico",
                column: "remetente_id");

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_servico_servico_id_criado_em",
                table: "mensagens_servico",
                columns: new[] { "servico_id", "criado_em" });

            migrationBuilder.CreateIndex(
                name: "IX_servicos_aguardando_confirmacao_desde",
                table: "servicos",
                column: "aguardando_confirmacao_desde");

            migrationBuilder.CreateIndex(
                name: "IX_servicos_cliente_id",
                table: "servicos",
                column: "cliente_id");

            migrationBuilder.CreateIndex(
                name: "IX_servicos_prestador_id",
                table: "servicos",
                column: "prestador_id");

            migrationBuilder.CreateIndex(
                name: "IX_servicos_status",
                table: "servicos",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_tokens_renovacao_token",
                table: "tokens_renovacao",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tokens_renovacao_usuario_id_revogado_em",
                table: "tokens_renovacao",
                columns: new[] { "usuario_id", "revogado_em" });

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_email",
                table: "usuarios",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_slug",
                table: "usuarios",
                column: "slug",
                unique: true,
                filter: "slug IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cobrancas");

            migrationBuilder.DropTable(
                name: "dados_bancarios");

            migrationBuilder.DropTable(
                name: "mensagens_servico");

            migrationBuilder.DropTable(
                name: "tokens_renovacao");

            migrationBuilder.DropTable(
                name: "servicos");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
