-- ============================================================
--  Prontto — Database Schema
--  PostgreSQL 17
--  Fonte da verdade: ARCHITECTURE.md v1.1
--  Gerado em: 2026-06-03
--
--  Execução em ambiente limpo:
--    psql -U postgres -d prontto -f schema.sql
--
--  Para recriar do zero (dev/CI apenas):
--    DROP SCHEMA public CASCADE; CREATE SCHEMA public;
--    psql -U postgres -d prontto -f schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- 0. EXTENSÕES
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_bytes(), crypt()

-- ------------------------------------------------------------
-- 1. TIPOS ENUMERADOS
-- ------------------------------------------------------------

CREATE TYPE tipo_conta AS ENUM (
    'cliente',
    'prestador'
);

CREATE TYPE papel AS ENUM (
    'usuario',
    'admin'
);

-- Máquina de estados do Servico (ARCHITECTURE.md §7.1)
CREATE TYPE status_servico AS ENUM (
    'em_negociacao',
    'aguardando_pagamento',
    'pago',
    'em_andamento',
    'aguardando_confirmacao_cliente',
    'em_disputa',
    'concluido',
    'cancelado'
);

-- Máquina de estados da Cobranca (ARCHITECTURE.md §7.2)
CREATE TYPE status_cobranca AS ENUM (
    'pendente',
    'pago',
    'retido',
    'liberado',
    'reembolsado',
    'cancelado'
);

CREATE TYPE tipo_chave_pix AS ENUM (
    'cpf',
    'cnpj',
    'email',
    'telefone',
    'aleatoria'
);

CREATE TYPE tipo_mensagem AS ENUM (
    'texto',
    'imagem',
    'proposta',
    'sistema'
);

CREATE TYPE status_proposta AS ENUM (
    'pendente',
    'aceita',
    'recusada',
    'expirada'
);

CREATE TYPE papel_remetente AS ENUM (
    'cliente',
    'prestador',
    'admin',
    'sistema'
);

-- Máquina de estados da Disputa (ARCHITECTURE.md §4.14)
CREATE TYPE status_disputa AS ENUM (
    'aberta',
    'em_analise',
    'resolvida_cliente',
    'resolvida_prestador'
);

CREATE TYPE tipo_notificacao AS ENUM (
    'proposta',
    'pagamento',
    'disputa',
    'avaliacao',
    'conclusao',
    'sistema'
);

-- ------------------------------------------------------------
-- 2. FUNÇÃO AUXILIAR: atualizar atualizado_em automaticamente
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS
$$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_set_updated_at() IS
    'Trigger genérico para manter atualizado_em sincronizado em qualquer UPDATE.';

-- ============================================================
--  TABELAS
--  Ordem respeita dependências de FK para execução linear.
-- ============================================================

-- ============================================================
--  categorias
--  Catálogo canônico de categorias de serviço.
--  Toda referência a categoria usa FK aqui — nunca string livre.
-- ============================================================
CREATE TABLE categorias (
    id              UUID        NOT NULL DEFAULT uuid_generate_v4(),
    nome            TEXT        NOT NULL,
    slug            TEXT        NOT NULL,
    ativo          BOOLEAN     NOT NULL DEFAULT TRUE,
    ordem_exibicao   INTEGER     NOT NULL DEFAULT 0,

    -- PK
    CONSTRAINT pk_categorias
        PRIMARY KEY (id),

    -- Unicidade
    CONSTRAINT uq_categorias_slug
        UNIQUE (slug),

    -- Domínio
    CONSTRAINT ck_categorias_display_order
        CHECK (ordem_exibicao >= 0),
    CONSTRAINT ck_categorias_slug_format
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

COMMENT ON TABLE  categorias                IS 'Catálogo canônico de categorias. FK obrigatório — nunca string livre.';
COMMENT ON COLUMN categorias.slug           IS 'Kebab-case único. Ex: encanador, eletricista. Imutável após uso em produção.';
COMMENT ON COLUMN categorias.ativo         IS 'Categorias inativas não aparecem na busca ou no cadastro de prestadores.';
COMMENT ON COLUMN categorias.ordem_exibicao  IS 'Ordena a exibição no frontend.';

-- ============================================================
--  cidades
--  Catálogo de cidades cobertas pela plataforma.
--  Toda referência a cidade usa FK aqui — nunca string livre.
-- ============================================================
CREATE TABLE cidades (
    id      UUID        NOT NULL DEFAULT uuid_generate_v4(),
    nome    TEXT        NOT NULL,
    estado   CHAR(2)     NOT NULL,
    slug    TEXT        NOT NULL,
    ativo  BOOLEAN     NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_cidades
        PRIMARY KEY (id),

    CONSTRAINT uq_cidades_slug
        UNIQUE (slug),

    CONSTRAINT ck_cidades_state
        CHECK (estado ~ '^[A-Z]{2}$'),
    CONSTRAINT ck_cidades_slug_format
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

COMMENT ON TABLE  cidades        IS 'Cidades cobertas pela plataforma. FK obrigatório — nunca string livre.';
COMMENT ON COLUMN cidades.estado  IS 'Sigla da UF em maiúsculas. Ex: SP, RJ, MG.';
COMMENT ON COLUMN cidades.slug   IS 'Kebab-case único. Ex: itapevi, sao-paulo. Compõe a URL pública do prestador.';

-- ============================================================
--  usuarios
--  Todos os usuários: clientes, prestadores e admins.
--  Soft delete via deletado_em.
-- ============================================================
CREATE TABLE usuarios (
    id                  UUID            NOT NULL DEFAULT uuid_generate_v4(),
    nome                TEXT            NOT NULL,
    email               TEXT            NOT NULL,
    telefone               TEXT,
    hash_senha       TEXT            NOT NULL,
    tipo_conta        tipo_conta      NOT NULL,
    papel                papel           NOT NULL DEFAULT 'usuario',

    -- Campos de prestador
    especialidade           TEXT,                               -- legado; preferir usuarios_categorias
    cidade_id             UUID,                               -- cidade principal (FK → cidades)
    cpf                 TEXT,                               -- AES-256 na aplicação (LGPD)
    url_foto_perfil   TEXT,
    slug                TEXT,                               -- imutável após publicação
    descricao         TEXT,

    -- Métricas calculadas
    media_avaliacoes      NUMERIC(3,2)    NOT NULL DEFAULT 0.00,
    total_avaliacoes        INTEGER         NOT NULL DEFAULT 0,

    -- Auditoria de linha
    criado_em          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deletado_em          TIMESTAMPTZ,                        -- soft delete

    -- PK
    CONSTRAINT pk_usuarios
        PRIMARY KEY (id),

    -- Unicidade
    CONSTRAINT uq_usuarios_email
        UNIQUE (email),
    CONSTRAINT uq_usuarios_slug
        UNIQUE (slug),

    -- Domínio
    CONSTRAINT ck_usuarios_rating_average
        CHECK (media_avaliacoes BETWEEN 0 AND 5),
    CONSTRAINT ck_usuarios_rating_count
        CHECK (total_avaliacoes >= 0),
    CONSTRAINT ck_usuarios_email_format
        CHECK (email = LOWER(email)),

    -- FK
    CONSTRAINT fk_usuarios_city
        FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE SET NULL
);

-- Índices: busca pública e login (filtro soft delete)
CREATE UNIQUE INDEX uq_usuarios_email_active
    ON usuarios(email) WHERE deletado_em IS NULL;

CREATE UNIQUE INDEX uq_usuarios_slug_active
    ON usuarios(slug) WHERE deletado_em IS NULL AND slug IS NOT NULL;

CREATE INDEX ix_usuarios_account_type
    ON usuarios(tipo_conta) WHERE deletado_em IS NULL;

CREATE INDEX ix_usuarios_city_id
    ON usuarios(cidade_id) WHERE deletado_em IS NULL;

-- Trigger atualizado_em
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMENT ON TABLE  usuarios                 IS 'Usuários da plataforma: clientes, prestadores e admins.';
COMMENT ON COLUMN usuarios.cpf             IS 'Armazenado criptografado via AES-256 na camada de aplicação (LGPD). Nunca retornar em endpoints públicos.';
COMMENT ON COLUMN usuarios.slug            IS 'Identificador único legível para URL pública. IMUTÁVEL após publicação do perfil (ADR-09). Formato: nome-sobrenome-xxxx.';
COMMENT ON COLUMN usuarios.especialidade       IS 'Campo legado. Preferir usuarios_categorias para categorias estruturadas.';
COMMENT ON COLUMN usuarios.media_avaliacoes  IS 'Recalculado pelo job após cada nova avaliação. Não atualizar manualmente.';
COMMENT ON COLUMN usuarios.deletado_em      IS 'Soft delete. Filtro global do EF Core exclui registros com valor preenchido. Dados financeiros são preservados por obrigação legal.';

-- ============================================================
--  tokens_renovacao
--  Tokens de renovação de sessão JWT com rotação obrigatória.
--  Access Token: 15 min | Refresh Token: 30 dias (ADR-10, §10.1)
-- ============================================================
CREATE TABLE tokens_renovacao (
    id                  UUID        NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id             UUID        NOT NULL,
    token               TEXT        NOT NULL,   -- hash SHA-256 do valor bruto
    expira_em          TIMESTAMPTZ NOT NULL,
    revogado_em          TIMESTAMPTZ,
    substituido_por   TEXT,                   -- hash do token sucessor (rastreabilidade)
    endereco_ip          TEXT,
    user_agent          TEXT,
    criado_em          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_tokens_renovacao
        PRIMARY KEY (id),

    CONSTRAINT uq_tokens_renovacao_token
        UNIQUE (token),

    CONSTRAINT ck_tokens_renovacao_expiry
        CHECK (expira_em > criado_em),

    CONSTRAINT fk_tokens_renovacao_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Sessões ativas de um usuário (renovação, logout)
CREATE INDEX ix_tokens_renovacao_user_active
    ON tokens_renovacao(usuario_id, expira_em)
    WHERE revogado_em IS NULL;

-- Job de limpeza de tokens expirados
CREATE INDEX ix_tokens_renovacao_expires_at
    ON tokens_renovacao(expira_em)
    WHERE revogado_em IS NULL;

COMMENT ON TABLE  tokens_renovacao                    IS 'Tokens de renovação de sessão. Rotação obrigatória a cada uso. Hash SHA-256 armazenado — nunca o valor bruto.';
COMMENT ON COLUMN tokens_renovacao.token              IS 'SHA-256 do Refresh Token. O valor bruto trafega apenas no cookie HttpOnly; Secure; SameSite=Strict.';
COMMENT ON COLUMN tokens_renovacao.substituido_por  IS 'Hash do token sucessor após rotação. Permite detectar reuso de token revogado (sinal de comprometimento).';

-- ============================================================
--  usuarios_categorias
--  M2M: prestador ↔ categorias onde atua.
--  Cardinalidade: 1 usuário — N categorias.
-- ============================================================
CREATE TABLE usuarios_categorias (
    usuario_id     UUID    NOT NULL,
    categoria_id UUID    NOT NULL,

    CONSTRAINT pk_usuarios_categorias
        PRIMARY KEY (usuario_id, categoria_id),

    CONSTRAINT fk_usuarios_categorias_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

    CONSTRAINT fk_usuarios_categorias_category
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

CREATE INDEX ix_usuarios_categorias_category_id
    ON usuarios_categorias(categoria_id);

COMMENT ON TABLE usuarios_categorias IS 'Categorias de atuação do prestador. FK para categorias — nunca string livre.';

-- ============================================================
--  usuarios_cidades
--  M2M: prestador ↔ cidades onde atua.
--  Cardinalidade: 1 usuário — N cidades.
-- ============================================================
CREATE TABLE usuarios_cidades (
    usuario_id  UUID    NOT NULL,
    cidade_id  UUID    NOT NULL,

    CONSTRAINT pk_usuarios_cidades
        PRIMARY KEY (usuario_id, cidade_id),

    CONSTRAINT fk_usuarios_cidades_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

    CONSTRAINT fk_usuarios_cidades_city
        FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE RESTRICT
);

CREATE INDEX ix_usuarios_cidades_city_id
    ON usuarios_cidades(cidade_id);

COMMENT ON TABLE usuarios_cidades IS 'Cidades de atuação do prestador. FK para cidades — substitui campos city/city_slug em texto livre.';

-- ============================================================
--  imagens_portfolio
--  Imagens de portfólio do prestador hospedadas no Cloudinary.
--  Soft delete via deletado_em.
-- ============================================================
CREATE TABLE imagens_portfolio (
    id                      UUID        NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id                 UUID        NOT NULL,
    url                     TEXT        NOT NULL,
    cloudinary_public_id    TEXT        NOT NULL,
    moderado               BOOLEAN     NOT NULL DEFAULT FALSE,
    aprovado                BOOLEAN,                -- NULL=pendente, TRUE=aprovada, FALSE=rejeitada
    ordem_exibicao           INTEGER     NOT NULL DEFAULT 0,
    criado_em              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deletado_em              TIMESTAMPTZ,

    CONSTRAINT pk_imagens_portfolio
        PRIMARY KEY (id),

    CONSTRAINT ck_imagens_portfolio_display_order
        CHECK (ordem_exibicao >= 0),

    CONSTRAINT fk_imagens_portfolio_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX ix_imagens_portfolio_user_active
    ON imagens_portfolio(usuario_id, ordem_exibicao)
    WHERE deletado_em IS NULL AND aprovado = TRUE;

-- Job de moderação (busca imagens pendentes)
CREATE INDEX ix_imagens_portfolio_pending_moderation
    ON imagens_portfolio(criado_em)
    WHERE moderado = FALSE AND deletado_em IS NULL;

-- Job de limpeza de orphans (rejeitadas há > 7 dias)
CREATE INDEX ix_imagens_portfolio_rejected
    ON imagens_portfolio(criado_em)
    WHERE aprovado = FALSE AND deletado_em IS NULL;

COMMENT ON TABLE  imagens_portfolio          IS 'Imagens de trabalhos do prestador. Exibidas somente após aprovado = TRUE.';
COMMENT ON COLUMN imagens_portfolio.aprovado IS 'NULL = pendente de moderação. TRUE = aprovada pelo Cloudinary. FALSE = rejeitada; arquivo deve ser deletado do Cloudinary pelo job de limpeza.';

-- ============================================================
--  dados_bancarios
--  Dados PIX e bancários do prestador para recebimento.
--  Cardinalidade: 1 usuário — 1 registro (unique usuario_id).
-- ============================================================
CREATE TABLE dados_bancarios (
    id              UUID            NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id         UUID            NOT NULL,
    tipo_chave_pix    tipo_chave_pix  NOT NULL,
    chave_pix         TEXT            NOT NULL,
    nome_completo       TEXT            NOT NULL,
    cpf_cnpj        TEXT            NOT NULL,   -- AES-256 na aplicação (LGPD)
    nome_banco       TEXT,
    agencia          TEXT,
    numero_conta  TEXT,
    tipo_conta    TEXT,
    criado_em      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_dados_bancarios
        PRIMARY KEY (id),

    CONSTRAINT uq_dados_bancarios_user_id
        UNIQUE (usuario_id),

    CONSTRAINT fk_dados_bancarios_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TRIGGER trg_dados_bancarios_updated_at
    BEFORE UPDATE ON dados_bancarios
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMENT ON TABLE  dados_bancarios          IS 'Dados bancários e PIX do prestador. Acesso restrito ao próprio prestador e admin (LGPD).';
COMMENT ON COLUMN dados_bancarios.cpf_cnpj IS 'AES-256 via camada de aplicação. Nunca retornado em endpoints públicos.';
COMMENT ON COLUMN dados_bancarios.chave_pix  IS 'Valor da chave Pix conforme tipo_chave_pix.';

-- ============================================================
--  servicos
--  Agregado central da plataforma.
--  Representa a ordem de serviço do início ao fim.
--  Soft delete via deletado_em.
-- ============================================================
CREATE TABLE servicos (
    id                              UUID            NOT NULL DEFAULT uuid_generate_v4(),
    titulo                           TEXT            NOT NULL,
    descricao                     TEXT,
    categoria_id                     UUID            NOT NULL,
    cidade_id                         UUID,
    cliente_id                       UUID,
    prestador_id                     UUID,
    preco                           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    taxa_admin_percentual                  NUMERIC(6,4)    NOT NULL DEFAULT 0.2000,
    status                          status_servico  NOT NULL DEFAULT 'em_negociacao',
    endereco                         TEXT,
    agendado_em                    TIMESTAMPTZ,
    concluido_em                    TIMESTAMPTZ,
    aguardando_confirmacao_desde     TIMESTAMPTZ,
    criado_em                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deletado_em                      TIMESTAMPTZ,

    CONSTRAINT pk_servicos
        PRIMARY KEY (id),

    -- Domínio
    CONSTRAINT ck_servicos_price
        CHECK (preco >= 0),
    CONSTRAINT ck_servicos_admin_fee_rate
        CHECK (taxa_admin_percentual BETWEEN 0 AND 1),
    CONSTRAINT ck_servicos_completed_at
        CHECK (concluido_em IS NULL OR concluido_em >= criado_em),
    CONSTRAINT ck_servicos_awaiting_confirmation
        CHECK (
            (status = 'aguardando_confirmacao_cliente' AND aguardando_confirmacao_desde IS NOT NULL)
            OR (status != 'aguardando_confirmacao_cliente')
        ),

    -- FK
    CONSTRAINT fk_servicos_category
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    CONSTRAINT fk_servicos_city
        FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE SET NULL,
    CONSTRAINT fk_servicos_client
        FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_servicos_provider
        FOREIGN KEY (prestador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Serviços do cliente
CREATE INDEX ix_servicos_client_id
    ON servicos(cliente_id, criado_em DESC) WHERE deletado_em IS NULL;

-- Serviços do prestador
CREATE INDEX ix_servicos_provider_id
    ON servicos(prestador_id, criado_em DESC) WHERE deletado_em IS NULL;

-- Filtro por status (admin, painéis)
CREATE INDEX ix_servicos_status
    ON servicos(status, criado_em DESC) WHERE deletado_em IS NULL;

-- Busca por categoria/cidade
CREATE INDEX ix_servicos_category_id
    ON servicos(categoria_id) WHERE deletado_em IS NULL;
CREATE INDEX ix_servicos_city_id
    ON servicos(cidade_id) WHERE deletado_em IS NULL;

-- CRÍTICO: job de auto-conclusão em 7 dias (JobConclusaoAutomatica)
CREATE INDEX ix_servicos_awaiting_confirmation
    ON servicos(aguardando_confirmacao_desde)
    WHERE status = 'aguardando_confirmacao_cliente'
      AND aguardando_confirmacao_desde IS NOT NULL
      AND deletado_em IS NULL;

-- Solicitações disponíveis para prestadores (sem provider vinculado)
CREATE INDEX ix_servicos_available_for_providers
    ON servicos(categoria_id, cidade_id, criado_em DESC)
    WHERE status = 'em_negociacao'
      AND prestador_id IS NULL
      AND deletado_em IS NULL;

-- Disputas ativas
CREATE INDEX ix_servicos_em_disputa
    ON servicos(id)
    WHERE status = 'em_disputa' AND deletado_em IS NULL;

CREATE TRIGGER trg_servicos_updated_at
    BEFORE UPDATE ON servicos
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMENT ON TABLE  servicos                              IS 'Agregado central da plataforma. Ciclo completo: negociação → pagamento → execução → conclusão.';
COMMENT ON COLUMN servicos.preco                        IS 'NUMERIC(12,2) — nunca double/float. Valor final acordado entre as partes.';
COMMENT ON COLUMN servicos.taxa_admin_percentual               IS 'Taxa da plataforma. Padrão 0.2000 (20%). Registrado no serviço para histórico imutável.';
COMMENT ON COLUMN servicos.aguardando_confirmacao_desde  IS 'Preenchido ao entrar em awaiting_confirmation_client. Base para o JobConclusaoAutomatica (7 dias).';
COMMENT ON COLUMN servicos.deletado_em                   IS 'Soft delete. Serviços com histórico financeiro preservados por obrigação legal.';

-- ============================================================
--  cobrancas
--  Ciclo financeiro de um serviço.
--  1 serviço → 1 cobrança (unique servico_id).
-- ============================================================
CREATE TABLE cobrancas (
    id                  UUID                NOT NULL DEFAULT uuid_generate_v4(),
    servico_id          UUID                NOT NULL,
    valor_total        NUMERIC(12,2)       NOT NULL,
    taxa_admin           NUMERIC(12,2)       NOT NULL,
    valor_prestador     NUMERIC(12,2)       NOT NULL,
    status              status_cobranca     NOT NULL DEFAULT 'pendente',
    pagarme_order_id    TEXT,
    pagarme_payment_id  TEXT,
    pix_qr_code         TEXT,
    pix_copia_cola      TEXT,
    pix_expira_em      TIMESTAMPTZ,
    pago_em             TIMESTAMPTZ,
    retido_em             TIMESTAMPTZ,
    liberado_em         TIMESTAMPTZ,
    criado_em          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_cobrancas
        PRIMARY KEY (id),

    -- 1:1 com serviço
    CONSTRAINT uq_cobrancas_service_id
        UNIQUE (servico_id),

    -- Idempotência de webhook (ADR-10, §9 Job 6)
    CONSTRAINT uq_cobrancas_pagarme_order_id
        UNIQUE (pagarme_order_id),

    -- Domínio financeiro
    CONSTRAINT ck_cobrancas_total_amount
        CHECK (valor_total > 0),
    CONSTRAINT ck_cobrancas_admin_fee
        CHECK (taxa_admin >= 0),
    CONSTRAINT ck_cobrancas_provider_amount
        CHECK (valor_prestador >= 0),
    CONSTRAINT ck_cobrancas_amounts_consistency
        CHECK (ABS(valor_total - taxa_admin - valor_prestador) < 0.01),

    -- Timestamps ordenados logicamente
    CONSTRAINT ck_cobrancas_held_after_paid
        CHECK (retido_em IS NULL OR pago_em IS NULL OR retido_em >= pago_em),
    CONSTRAINT ck_cobrancas_released_after_held
        CHECK (liberado_em IS NULL OR retido_em IS NULL OR liberado_em >= retido_em),

    CONSTRAINT fk_cobrancas_service
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT
);

-- CRÍTICO: job de expiração de PIX (JobExpiracaoPix)
CREATE INDEX ix_cobrancas_pix_expiry
    ON cobrancas(pix_expira_em)
    WHERE status = 'pendente' AND pix_expira_em IS NOT NULL;

-- Filtros por status (admin, extrato)
CREATE INDEX ix_cobrancas_status
    ON cobrancas(status, criado_em DESC);

-- Cobranças retidas (monitoramento de repasse pendente)
CREATE INDEX ix_cobrancas_retidas
    ON cobrancas(retido_em)
    WHERE status = 'retido';

CREATE TRIGGER trg_cobrancas_updated_at
    BEFORE UPDATE ON cobrancas
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

COMMENT ON TABLE  cobrancas                       IS 'Transação financeira de um serviço. Criada quando serviço avança para aguardando_pagamento.';
COMMENT ON COLUMN cobrancas.taxa_admin             IS 'valor_total × taxa_admin_percentual do serviço associado. Calculado na criação, imutável.';
COMMENT ON COLUMN cobrancas.valor_prestador       IS 'valor_total − taxa_admin. Valor transferido ao prestador após conclusão.';
COMMENT ON COLUMN cobrancas.pagarme_order_id      IS 'UNIQUE garante idempotência: webhooks duplicados da Pagar.me não reprocessam.';
COMMENT ON COLUMN cobrancas.retido_em               IS 'Preenchido quando PIX confirmado. Valor sob custódia da plataforma (ADR-10).';
COMMENT ON COLUMN cobrancas.liberado_em           IS 'Preenchido após split 80/20 executado via IProcessadorPagamento.TransferirAsync().';

-- ============================================================
--  mensagens_servico
--  Chat do serviço. Suporta texto, imagens e propostas.
--  Propostas são mensagens com campos extras (ADR-04).
-- ============================================================
CREATE TABLE mensagens_servico (
    id                  UUID                NOT NULL DEFAULT uuid_generate_v4(),
    servico_id          UUID                NOT NULL,
    remetente_id           UUID,                               -- NULL para mensagens de sistema
    papel_remetente         papel_remetente     NOT NULL,
    tipo_mensagem        tipo_mensagem       NOT NULL,
    conteudo             TEXT                NOT NULL,
    valor_proposta     NUMERIC(12,2),
    status_proposta     status_proposta,
    imagem_moderada     BOOLEAN             NOT NULL DEFAULT FALSE,
    imagem_aprovada      BOOLEAN,
    criado_em          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_mensagens_servico
        PRIMARY KEY (id),

    -- Proposta exige valor e status
    CONSTRAINT ck_mensagens_servico_proposal_fields
        CHECK (
            (tipo_mensagem = 'proposta' AND valor_proposta IS NOT NULL AND valor_proposta > 0 AND status_proposta IS NOT NULL)
            OR (tipo_mensagem != 'proposta' AND valor_proposta IS NULL AND status_proposta IS NULL)
        ),

    -- Moderação de imagem somente em mensagens do tipo imagem
    CONSTRAINT ck_mensagens_servico_image_fields
        CHECK (
            tipo_mensagem = 'imagem'
            OR (imagem_moderada = FALSE AND imagem_aprovada IS NULL)
        ),

    CONSTRAINT fk_mensagens_servico_service
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_mensagens_servico_sender
        FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- PRINCIPAL: paginação cursor-based do chat (afterId / afterCreatedAt)
CREATE INDEX ix_mensagens_servico_chat_cursor
    ON mensagens_servico(servico_id, criado_em ASC, id ASC);

-- CRÍTICO: somente 1 proposta pendente por serviço (ADR-04)
CREATE UNIQUE INDEX uq_mensagens_servico_pending_proposal
    ON mensagens_servico(servico_id)
    WHERE tipo_mensagem = 'proposta' AND status_proposta = 'pendente';

-- Moderação: imagens pendentes
CREATE INDEX ix_mensagens_servico_pending_moderation
    ON mensagens_servico(servico_id, criado_em)
    WHERE tipo_mensagem = 'imagem' AND imagem_moderada = FALSE;

COMMENT ON TABLE  mensagens_servico                  IS 'Chat do serviço. Texto, imagens e propostas num único stream (ADR-04).';
COMMENT ON COLUMN mensagens_servico.remetente_id        IS 'NULL para mensagens de sistema (mudanças de status, eventos automáticos).';
COMMENT ON INDEX  uq_mensagens_servico_pending_proposal IS 'Garante máximo 1 proposta pendente por serviço a qualquer momento.';

-- ============================================================
--  avaliacoes
--  Avaliação bilateral após conclusão.
--  Cardinalidade: 1 serviço → 2 avaliações (cliente ↔ prestador).
-- ============================================================
CREATE TABLE avaliacoes (
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    servico_id  UUID        NOT NULL,
    avaliador_id UUID        NOT NULL,
    avaliado_id UUID        NOT NULL,
    nota      SMALLINT    NOT NULL,
    comentario     TEXT,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_avaliacoes
        PRIMARY KEY (id),

    -- 1 avaliação por pessoa por serviço
    CONSTRAINT uq_avaliacoes_service_reviewer
        UNIQUE (servico_id, avaliador_id),

    -- Domínio
    CONSTRAINT ck_avaliacoes_rating
        CHECK (nota BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacoes_comment_length
        CHECK (comentario IS NULL OR LENGTH(comentario) <= 1000),
    CONSTRAINT ck_avaliacoes_self_review
        CHECK (avaliador_id != avaliado_id),

    CONSTRAINT fk_avaliacoes_service
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_avaliacoes_reviewer
        FOREIGN KEY (avaliador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_avaliacoes_reviewed
        FOREIGN KEY (avaliado_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Avaliações recebidas por um usuário (cálculo de média)
CREATE INDEX ix_avaliacoes_reviewed_id
    ON avaliacoes(avaliado_id, criado_em DESC);

-- Avaliações de um serviço específico
CREATE INDEX ix_avaliacoes_service_id
    ON avaliacoes(servico_id);

COMMENT ON TABLE  avaliacoes                       IS 'Avaliação bilateral pós-conclusão. Constraint unique(servico_id, avaliador_id) impede avaliação dupla.';
COMMENT ON COLUMN avaliacoes.nota                IS 'SMALLINT 1-5. Reforçado por CHECK constraint.';
COMMENT ON COLUMN avaliacoes.comentario               IS 'Opcional. Máximo 1000 caracteres.';

-- ============================================================
--  disputas
--  Contestação de conclusão aberta pelo cliente.
--  1 disputa por serviço (unique servico_id).
-- ============================================================
CREATE TABLE disputas (
    id              UUID            NOT NULL DEFAULT uuid_generate_v4(),
    servico_id      UUID            NOT NULL,
    aberto_por_id    UUID            NOT NULL,
    motivo          TEXT            NOT NULL,
    descricao     TEXT,
    status          status_disputa  NOT NULL DEFAULT 'aberta',
    resolvido_por_id  UUID,
    decisao_admin  TEXT,
    criado_em      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    resolvido_em     TIMESTAMPTZ,

    CONSTRAINT pk_disputas
        PRIMARY KEY (id),

    -- 1 disputa por serviço
    CONSTRAINT uq_disputas_service_id
        UNIQUE (servico_id),

    -- Resolução exige todos os campos de decisão
    CONSTRAINT ck_disputas_resolution_fields
        CHECK (
            (status IN ('resolvida_cliente', 'resolvida_prestador')
                AND resolvido_por_id IS NOT NULL
                AND decisao_admin IS NOT NULL
                AND resolvido_em IS NOT NULL)
            OR status NOT IN ('resolvida_cliente', 'resolvida_prestador')
        ),

    CONSTRAINT ck_disputas_resolved_at_order
        CHECK (resolvido_em IS NULL OR resolvido_em >= criado_em),

    CONSTRAINT fk_disputas_service
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputas_opened_by
        FOREIGN KEY (aberto_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputas_resolved_by
        FOREIGN KEY (resolvido_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Disputas abertas/em análise (fila do admin)
CREATE INDEX ix_disputas_open
    ON disputas(criado_em ASC)
    WHERE status IN ('aberta', 'em_analise');

CREATE INDEX ix_disputas_opened_by_id
    ON disputas(aberto_por_id);

COMMENT ON TABLE  disputas                  IS 'Contestação de conclusão. Criada pelo cliente de AguardandoConfirmacaoCliente. Pagamento permanece retido até resolução.';
COMMENT ON COLUMN disputas.motivo           IS 'Motivo selecionado pelo cliente. Ex: serviço não executado, qualidade insatisfatória.';
COMMENT ON COLUMN disputas.decisao_admin   IS 'Obrigatório ao resolver. Justificativa textual gravada no AuditLog.';

-- ============================================================
--  notificacoes
--  Notificações in-app geradas por eventos de domínio.
-- ============================================================
CREATE TABLE notificacoes (
    id           UUID                NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id      UUID                NOT NULL,
    titulo        TEXT                NOT NULL,
    mensagem      TEXT                NOT NULL,
    lido         BOOLEAN             NOT NULL DEFAULT FALSE,
    tipo         tipo_notificacao    NOT NULL,
    referencia_id TEXT,
    criado_em   TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_notificacoes
        PRIMARY KEY (id),

    CONSTRAINT fk_notificacoes_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- PRINCIPAL: não-lidas por usuário (polling a cada 10s no frontend)
CREATE INDEX ix_notificacoes_user_unread
    ON notificacoes(usuario_id, criado_em DESC)
    WHERE lido = FALSE;

-- Listagem geral por usuário
CREATE INDEX ix_notificacoes_user_all
    ON notificacoes(usuario_id, criado_em DESC);

COMMENT ON TABLE  notificacoes             IS 'Notificações in-app. Geradas por handlers de eventos de domínio (V1: polling 10s; V2: SignalR).';
COMMENT ON COLUMN notificacoes.tipo        IS 'Enum tipo_notificacao. Permite filtrar por categoria de evento no frontend.';
COMMENT ON COLUMN notificacoes.referencia_id IS 'ID da entidade relacionada (ServicoId, DisputaId, etc.) para deep linking.';

-- ============================================================
--  logs_auditoria
--  Trilha de auditoria imutável (append-only).
--  NUNCA deletar registros. Sem trigger atualizado_em.
-- ============================================================
CREATE TABLE logs_auditoria (
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id     UUID,                           -- NULL para ações de job/sistema
    acao      TEXT        NOT NULL,
    entidade      TEXT        NOT NULL,
    entidade_id   TEXT,
    endereco_ip  TEXT,
    user_agent  TEXT,
    detalhes     JSONB,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_logs_auditoria
        PRIMARY KEY (id),

    CONSTRAINT fk_logs_auditoria_user
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Auditoria por usuário (admin: "o que esse usuário fez?")
CREATE INDEX ix_logs_auditoria_user_created
    ON logs_auditoria(usuario_id, criado_em DESC);

-- Auditoria por entidade (admin: "quem mexeu nesse serviço?")
CREATE INDEX ix_logs_auditoria_entity
    ON logs_auditoria(entidade, entidade_id, criado_em DESC);

-- Listagem cronológica geral
CREATE INDEX ix_logs_auditoria_created_at
    ON logs_auditoria(criado_em DESC);

-- Busca por tipo de ação
CREATE INDEX ix_logs_auditoria_action
    ON logs_auditoria(acao, criado_em DESC);

COMMENT ON TABLE  logs_auditoria            IS 'Trilha de auditoria IMUTÁVEL. Registros NUNCA devem ser deletados. Tabela append-only.';
COMMENT ON COLUMN logs_auditoria.usuario_id    IS 'NULL para ações de jobs. Actions de job prefixadas com "job.". Ex: job.conclusao_automatica.';
COMMENT ON COLUMN logs_auditoria.acao     IS 'Ação no formato entidade.verbo. Ex: usuario.login, servico.criado, pagamento.liberado.';
COMMENT ON COLUMN logs_auditoria.detalhes    IS 'JSONB: contexto adicional, campos alterados, valores anteriores. Flexível por tipo de ação.';

-- ============================================================
--  VIEWS — Queries frequentes pré-compiladas
-- ============================================================

-- Prestadores ativos com suas cidades (busca pública)
CREATE OR REPLACE VIEW vw_prestadores_publicos AS
SELECT
    u.id,
    u.nome,
    u.slug,
    u.descricao,
    u.url_foto_perfil,
    u.media_avaliacoes,
    u.total_avaliacoes,
    ci.id       AS cidade_id,
    ci.slug     AS city_slug,
    ci.nome     AS city_name,
    ci.estado    AS city_state,
    cat.id      AS categoria_id,
    cat.slug    AS category_slug,
    cat.nome    AS category_name
FROM usuarios u
JOIN usuarios_cidades    uc  ON uc.usuario_id    = u.id
JOIN cidades         ci  ON ci.id         = uc.cidade_id
JOIN usuarios_categorias uca ON uca.usuario_id  = u.id
JOIN categorias     cat ON cat.id        = uca.categoria_id
WHERE u.tipo_conta    = 'prestador'
  AND u.deletado_em      IS NULL
  AND ci.ativo         = TRUE
  AND cat.ativo        = TRUE;

COMMENT ON VIEW vw_prestadores_publicos IS 'Prestadores ativos com cidades e categorias. Base para a busca pública /{cidadeSlug}/{categoriaSlug}/{slug}.';

-- Serviços que atingiram 7 dias sem resposta (JobConclusaoAutomatica)
CREATE OR REPLACE VIEW vw_servicos_para_autoconclusao AS
SELECT
    s.id            AS servico_id,
    s.prestador_id,
    s.cliente_id,
    s.aguardando_confirmacao_desde,
    s.preco,
    s.taxa_admin_percentual,
    c.id            AS charge_id,
    c.valor_prestador
FROM servicos s
JOIN cobrancas  c ON c.servico_id = s.id
WHERE s.status = 'aguardando_confirmacao_cliente'
  AND s.aguardando_confirmacao_desde IS NOT NULL
  AND s.aguardando_confirmacao_desde < NOW() - INTERVAL '7 days'
  AND s.deletado_em IS NULL
  AND c.status = 'retido';

COMMENT ON VIEW vw_servicos_para_autoconclusao IS 'Serviços prontos para auto-conclusão. Consumida pelo JobConclusaoAutomatica (execução a cada hora).';

-- PIX vencidos (JobExpiracaoPix)
CREATE OR REPLACE VIEW vw_cobrancas_pix_expirado AS
SELECT
    c.id            AS charge_id,
    c.servico_id,
    c.pix_expira_em,
    c.pagarme_order_id
FROM cobrancas c
WHERE c.status       = 'pendente'
  AND c.pix_expira_em IS NOT NULL
  AND c.pix_expira_em < NOW();

COMMENT ON VIEW vw_cobrancas_pix_expirado IS 'Cobranças com PIX vencido ainda pendentes. Consumida pelo JobExpiracaoPix (execução a cada 15 min).';

-- Cobranças retidas sem liberação há > 24h (alerta de risco)
CREATE OR REPLACE VIEW vw_cobrancas_retidas_alerta AS
SELECT
    c.id            AS charge_id,
    c.servico_id,
    c.valor_prestador,
    c.retido_em,
    s.prestador_id
FROM cobrancas  c
JOIN servicos s ON s.id = c.servico_id
WHERE c.status   = 'retido'
  AND s.status   = 'concluido'
  AND c.retido_em  < NOW() - INTERVAL '24 hours';

COMMENT ON VIEW vw_cobrancas_retidas_alerta IS 'Cobranças retidas com serviço já concluído há mais de 24h sem liberação. Base para alertas de monitoramento (Risco 1).';

-- Refresh tokens ativos por usuário (admin: ver sessões ativas)
CREATE OR REPLACE VIEW vw_sessoes_ativas AS
SELECT
    rt.id,
    rt.usuario_id,
    u.nome          AS user_name,
    u.email,
    rt.endereco_ip,
    rt.user_agent,
    rt.criado_em,
    rt.expira_em
FROM tokens_renovacao rt
JOIN usuarios u ON u.id = rt.usuario_id
WHERE rt.revogado_em IS NULL
  AND rt.expira_em > NOW();

COMMENT ON VIEW vw_sessoes_ativas IS 'Sessões ativas na plataforma. Admin pode revogar individualmente.';

-- ============================================================
--  SEED DATA — Categorias e Cidades iniciais
-- ============================================================

INSERT INTO categorias (id, nome, slug, ativo, ordem_exibicao) VALUES
    (uuid_generate_v4(), 'Encanador',           'encanador',        TRUE,  1),
    (uuid_generate_v4(), 'Eletricista',          'eletricista',       TRUE,  2),
    (uuid_generate_v4(), 'Pintor',               'pintor',            TRUE,  3),
    (uuid_generate_v4(), 'Pedreiro',             'pedreiro',          TRUE,  4),
    (uuid_generate_v4(), 'Marceneiro',           'marceneiro',        TRUE,  5),
    (uuid_generate_v4(), 'Diarista',             'diarista',          TRUE,  6),
    (uuid_generate_v4(), 'Jardineiro',           'jardineiro',        TRUE,  7),
    (uuid_generate_v4(), 'Técnico de Ar Cond.',  'ar-condicionado',   TRUE,  8),
    (uuid_generate_v4(), 'Serralheiro',          'serralheiro',       TRUE,  9),
    (uuid_generate_v4(), 'Dedetizador',          'dedetizador',       TRUE, 10);

INSERT INTO cidades (id, nome, estado, slug, ativo) VALUES
    (uuid_generate_v4(), 'Itapevi',        'SP', 'itapevi',         TRUE),
    (uuid_generate_v4(), 'São Paulo',      'SP', 'sao-paulo',       TRUE),
    (uuid_generate_v4(), 'Osasco',         'SP', 'osasco',          TRUE),
    (uuid_generate_v4(), 'Carapicuíba',    'SP', 'carapicuiba',     TRUE),
    (uuid_generate_v4(), 'Cotia',          'SP', 'cotia',           TRUE),
    (uuid_generate_v4(), 'Barueri',        'SP', 'barueri',         TRUE),
    (uuid_generate_v4(), 'Rio de Janeiro', 'RJ', 'rio-de-janeiro',  TRUE),
    (uuid_generate_v4(), 'Belo Horizonte', 'MG', 'belo-horizonte',  TRUE),
    (uuid_generate_v4(), 'Curitiba',       'PR', 'curitiba',        TRUE),
    (uuid_generate_v4(), 'Porto Alegre',   'RS', 'porto-alegre',    TRUE);

-- ============================================================
--  NOTAS DE PRODUÇÃO
-- ============================================================

-- PAGINAÇÃO
-- • Listagens (serviços, usuários, cobranças): OFFSET/LIMIT com max 50/página
--   SELECT ... ORDER BY criado_em DESC, id DESC LIMIT $limit OFFSET $offset
-- • Chat (mensagens_servico): cursor-based para evitar drift
--   WHERE (criado_em, id) < ($cursor_ts, $cursor_id)
--   ORDER BY criado_em DESC, id DESC LIMIT 50
-- • Audit logs: cursor-based (tabela de alto volume)

-- SOFT DELETE
-- • Tabelas: usuarios, servicos, imagens_portfolio
-- • Filtro automático via EF Core Global Query Filter (deletado_em IS NULL)
-- • Para acesso direto ao PostgreSQL em produção, ativar RLS se necessário:
--   ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY p_usuarios_active ON usuarios USING (deletado_em IS NULL);

-- AUDITORIA
-- • logs_auditoria é append-only. Nunca executar DELETE ou UPDATE nesta tabela.
-- • Arquivamento LGPD: após 90 dias, logs podem ser movidos para tabela de arquivo frio.
-- • Recomendado: particionamento por RANGE em criado_em (mensal) quando > 10M registros.

-- PERFORMANCE
-- • max_connections = 100 (configurar pool no EF Core: Max Pool Size=100)
-- • work_mem = 16MB mínimo para sorts de busca de prestadores
-- • shared_buffers = 25% da RAM disponível
-- • autovacuum habilitado (padrão) — crítico para mensagens_servico e logs_auditoria
-- • Monitorar BLOAT em cobrancas e mensagens_servico com pgstattuple

-- PARTICIONAMENTO (considerar após 10M registros)
-- • logs_auditoria: RANGE em criado_em (mensal)
-- • mensagens_servico: RANGE em criado_em (mensal)
-- • notificacoes: RANGE em criado_em + política de expiração (30 dias)

-- FIM DO SCHEMA
