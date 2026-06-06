using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Prontto.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RF04_ServicosDisputas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // NOTA: Esta migration é idempotente.
            // As tabelas disputas, logs_auditoria e notificacoes podem já existir no schema.sql.
            // As colunas categoria_id e cidade_id podem já existir no banco.
            // Todos os DDL usam IF NOT EXISTS / IF EXISTS para ser re-executáveis com segurança.

            // ── Servicos: remover coluna legada categoria (string livre) ───────────
            migrationBuilder.Sql(@"
                ALTER TABLE servicos DROP COLUMN IF EXISTS categoria;
            ");

            // ── Servicos: adicionar categoria_id (FK) ─────────────────────────────
            // Primeira vez: cria a coluna com valor padrão temporário para NOT NULL
            migrationBuilder.Sql(@"
                ALTER TABLE servicos ADD COLUMN IF NOT EXISTS categoria_id uuid;
            ");

            // Define um valor padrão para registros existentes sem categoria_id
            // (usa a primeira categoria ativa disponível, se houver)
            migrationBuilder.Sql(@"
                DO $$
                DECLARE primeira_categoria_id uuid;
                BEGIN
                    SELECT id INTO primeira_categoria_id FROM categorias WHERE ativo = true LIMIT 1;
                    IF primeira_categoria_id IS NOT NULL THEN
                        UPDATE servicos SET categoria_id = primeira_categoria_id WHERE categoria_id IS NULL;
                    ELSE
                        -- Se não há categorias, usa UUID zerado temporariamente
                        UPDATE servicos SET categoria_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE categoria_id IS NULL;
                    END IF;
                END $$;
            ");

            // Torna NOT NULL após preencher registros existentes
            migrationBuilder.Sql(@"
                ALTER TABLE servicos ALTER COLUMN categoria_id SET NOT NULL;
            ");

            // ── Servicos: adicionar cidade_id (FK) ────────────────────────────────
            migrationBuilder.Sql(@"
                ALTER TABLE servicos ADD COLUMN IF NOT EXISTS cidade_id uuid;
            ");

            // ── Tabela disputas ────────────────────────────────────────────────────
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS disputas (
                    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
                    servico_id      uuid        NOT NULL,
                    aberto_por_id   uuid        NOT NULL,
                    motivo          text        NOT NULL,
                    descricao       text,
                    status          text        NOT NULL DEFAULT 'Aberta',
                    resolvido_por_id uuid,
                    decisao_admin   text,
                    criado_em       timestamptz NOT NULL DEFAULT NOW(),
                    resolvido_em    timestamptz,
                    CONSTRAINT pk_disputas PRIMARY KEY (id),
                    CONSTRAINT fk_disputas_servico
                        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
                    CONSTRAINT fk_disputas_aberto_por
                        FOREIGN KEY (aberto_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
                    CONSTRAINT fk_disputas_resolvido_por
                        FOREIGN KEY (resolvido_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT
                );
            ");

            // ── Tabela logs_auditoria ──────────────────────────────────────────────
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS logs_auditoria (
                    id          uuid        NOT NULL DEFAULT gen_random_uuid(),
                    usuario_id  uuid,
                    acao        text        NOT NULL,
                    entidade    text        NOT NULL,
                    entidade_id text,
                    endereco_ip text,
                    user_agent  text,
                    detalhes    text,
                    criado_em   timestamptz NOT NULL DEFAULT NOW(),
                    CONSTRAINT pk_logs_auditoria PRIMARY KEY (id),
                    CONSTRAINT fk_logs_auditoria_usuario
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
                );
            ");

            // ── Tabela notificacoes ────────────────────────────────────────────────
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS notificacoes (
                    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
                    usuario_id      uuid        NOT NULL,
                    titulo          text        NOT NULL,
                    mensagem        text        NOT NULL,
                    lido            boolean     NOT NULL DEFAULT FALSE,
                    tipo            text        NOT NULL,
                    referencia_id   text,
                    criado_em       timestamptz NOT NULL DEFAULT NOW(),
                    CONSTRAINT pk_notificacoes PRIMARY KEY (id),
                    CONSTRAINT fk_notificacoes_usuario
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                );
            ");

            // ── Índices ────────────────────────────────────────────────────────────
            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_servicos_categoria_id"" ON servicos (categoria_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_servicos_cidade_id"" ON servicos (cidade_id);
            ");

            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_disputas_servico_id"" ON disputas (servico_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_disputas_status"" ON disputas (status);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_disputas_aberto_por_id"" ON disputas (aberto_por_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_disputas_resolvido_por_id"" ON disputas (resolvido_por_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_logs_auditoria_criado_em"" ON logs_auditoria (criado_em);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_logs_auditoria_entidade_entidade_id"" ON logs_auditoria (entidade, entidade_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_logs_auditoria_usuario_id_criado_em"" ON logs_auditoria (usuario_id, criado_em);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_notificacoes_usuario_id_lido_criado_em"" ON notificacoes (usuario_id, lido, criado_em);
            ");

            // ── FKs em servicos (adicionar apenas se não existirem) ────────────────
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE table_name = 'servicos'
                          AND constraint_name = 'FK_servicos_categorias_categoria_id'
                    ) THEN
                        ALTER TABLE servicos
                            ADD CONSTRAINT ""FK_servicos_categorias_categoria_id""
                            FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT;
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE table_name = 'servicos'
                          AND constraint_name = 'FK_servicos_cidades_cidade_id'
                    ) THEN
                        ALTER TABLE servicos
                            ADD CONSTRAINT ""FK_servicos_cidades_cidade_id""
                            FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE RESTRICT;
                    END IF;
                END $$;
            ");

            // ── EF Core Snapshot — PK_disputas via EF (para o snapshot ser consistente)
            // EF espera que a tabela tenha sido criada com sua convenção de nomeação.
            // Como usamos SQL manual, adicionamos o alias de constraint esperado pelo EF.
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE table_name = 'disputas' AND constraint_name = 'PK_disputas'
                    ) THEN
                        ALTER TABLE disputas RENAME CONSTRAINT pk_disputas TO ""PK_disputas"";
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE table_name = 'logs_auditoria' AND constraint_name = 'PK_logs_auditoria'
                    ) THEN
                        ALTER TABLE logs_auditoria RENAME CONSTRAINT pk_logs_auditoria TO ""PK_logs_auditoria"";
                    END IF;
                END $$;
            ");

            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE table_name = 'notificacoes' AND constraint_name = 'PK_notificacoes'
                    ) THEN
                        ALTER TABLE notificacoes RENAME CONSTRAINT pk_notificacoes TO ""PK_notificacoes"";
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"ALTER TABLE servicos DROP CONSTRAINT IF EXISTS ""FK_servicos_categorias_categoria_id"";");
            migrationBuilder.Sql(@"ALTER TABLE servicos DROP CONSTRAINT IF EXISTS ""FK_servicos_cidades_cidade_id"";");

            migrationBuilder.Sql(@"DROP TABLE IF EXISTS disputas;");
            migrationBuilder.Sql(@"DROP TABLE IF EXISTS logs_auditoria;");
            migrationBuilder.Sql(@"DROP TABLE IF EXISTS notificacoes;");

            migrationBuilder.Sql(@"DROP INDEX IF EXISTS ""IX_servicos_categoria_id"";");
            migrationBuilder.Sql(@"DROP INDEX IF EXISTS ""IX_servicos_cidade_id"";");

            migrationBuilder.Sql(@"ALTER TABLE servicos DROP COLUMN IF EXISTS categoria_id;");
            migrationBuilder.Sql(@"ALTER TABLE servicos DROP COLUMN IF EXISTS cidade_id;");

            migrationBuilder.AddColumn<string>(
                name: "categoria",
                table: "servicos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
