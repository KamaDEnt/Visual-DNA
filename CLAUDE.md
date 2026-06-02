# Prontto — Guia de Arquitetura e Desenvolvimento

Marketplace de serviços domésticos brasileiro. Monorepo com backend C# e frontend Angular.

## Convenção de Nomes

| Nível | Idioma | Exemplos |
|-------|--------|---------|
| Projetos / namespaces | Inglês | `Prontto.Domain`, `Prontto.Application`, `Prontto.Infrastructure` |
| Pastas internas | Inglês | `Entities`, `Repositories`, `Services`, `Controllers` |
| Classes, interfaces, variáveis, propriedades | Português | `Usuario`, `Servico`, `IRepositorioUsuario`, `ServicoAutenticacao` |

## Estrutura do Monorepo

```
Prontto/                          ← renomear pasta de Visual-DNA para Prontto
├── backend/
│   ├── Prontto.sln
│   ├── src/
│   │   ├── Prontto.Domain/
│   │   │   ├── Entities/         → Usuario, Servico, Cobranca, MensagemServico, DadosBancarios
│   │   │   ├── Enums/            → TipoConta, Papel, StatusServico, StatusCobranca, PapelRemetente, TipoChavePix
│   │   │   └── Interfaces/       → IRepositorioUsuario, IRepositorioServico, IRepositorioCobranca, IRepositorioBanking, IRepositorioMensagem
│   │   ├── Prontto.Application/
│   │   │   ├── Auth/             → ServicoAutenticacao, IServicoAutenticacao, IServicoJwt, ComandoCadastro, ComandoLogin, ResultadoAutenticacao
│   │   │   ├── Admin/            → ServicoAdmin, IServicoAdmin, EstatisticasAdmin
│   │   │   └── Common/           → IHashSenha, Excecoes (ExcecaoNaoEncontrado, ExcecaoConflito, etc.)
│   │   ├── Prontto.Infrastructure/
│   │   │   ├── Data/             → ContextoBancoDados (EF Core DbContext)
│   │   │   ├── Repositories/     → RepositorioUsuario, RepositorioServico, RepositorioCobranca, RepositorioBanking, RepositorioMensagem
│   │   │   ├── Services/         → ServicoJwt, HashSenhaBcrypt
│   │   │   └── InjecaoDependencias.cs
│   │   └── Prontto.Api/
│   │       ├── Controllers/      → ControladorAuth, ControladorAdmin, DtoUsuario
│   │       ├── Middlewares/      → MiddlewareExcecao
│   │       └── Program.cs
│   └── tests/
│       ├── Prontto.UnitTests/    → TestesServicoAutenticacao, TestesServicoAdmin
│       └── Prontto.IntegrationTests/
├── frontend/                     # Angular 21
│   └── src/app/
│       ├── core/
│       │   ├── auth/             → AuthService (signals), authGuard, adminGuard, authInterceptor
│       │   ├── api/              → AdminService, BankingService
│       │   └── models/           → usuario.model.ts (interfaces em português)
│       └── features/             # lazy-loaded
│           ├── home/
│           ├── servicos/
│           ├── como-funciona/
│           ├── para-prestadores/
│           ├── auth/entrar/ e auth/cadastrar/
│           ├── minha-area/
│           ├── admin/
│           └── not-found/
├── api-spec/
│   └── openapi.yaml              # Contrato OpenAPI 3.1 — fonte da verdade
├── attached_assets/              # Imagens e screenshots — NÃO DELETAR
└── docker-compose.yml
```

## Domínio

### Entidades (nomes em português)

| Classe C# | Tabela no banco | Descrição |
|-----------|----------------|-----------|
| `Usuario` | `users` | Clientes e prestadores |
| `Servico` | `services` | Ordem de serviço |
| `Cobranca` | `charges` | Cobrança gerada ao concluir serviço |
| `DadosBancarios` | `professional_banking` | Dados Pix do prestador |
| `MensagemServico` | `service_messages` | Chat por serviço |

### Propriedades principais de `Usuario`
`Id`, `Nome`, `Email`, `Telefone`, `HashSenha`, `TipoConta` (Cliente|Prestador), `Papel` (Usuario|Admin), `Especialidade`, `Cidade`

### Propriedades principais de `Servico`
`Id`, `Titulo`, `Descricao`, `Categoria`, `ClienteId`, `PrestadorId`, `Preco`, `TaxaAdminRate` (0.2000), `Status`, `Endereco`, `AgendadoEm`, `ConcluidoEm`

### Regra de negócio crítica
Ao marcar serviço como `StatusServico.Concluido`: criar automaticamente uma `Cobranca` com `TaxaAdmin = Preco * TaxaAdminRate` (padrão 20%) e `ValorPrestador = Preco - TaxaAdmin`.

## Backend C# — Padrões

### Clean Architecture (fluxo de dependências)
```
Domain → sem dependências (entidades, enums, interfaces de repositório)
Application → depende de Domain (serviços de aplicação, commands, interfaces)
Infrastructure → implementa interfaces de Domain (EF Core, repositórios, JWT, BCrypt)
Api → depende de Application + Infrastructure (controllers, middlewares, DI)
```

### Auth JWT
- Algoritmo: HS256, expiração 30 dias
- Chave: env var `SESSION_SECRET` (dev: `"prontto-secret-dev"`)
- Claims: `userId`, `email`, `accountType`, `role`
- `[Authorize(Roles = "admin")]` no `ControladorAdmin`

### Banco de Dados
- PostgreSQL + EF Core 9
- Mapeamento de colunas via `HasColumnName()` explícito em `ContextoBancoDados`
- UUIDs como PKs (`Guid`)
- Valores monetários: `decimal` — nunca `double` ou `float`
- Colunas em snake_case no banco (mapeadas explicitamente)

### Testes
- **UnitTests** (`Prontto.UnitTests`): xUnit + Moq + FluentAssertions, sem banco
- **IntegrationTests** (`Prontto.IntegrationTests`): WebApplicationFactory + banco real (docker)
- Todo novo serviço ou caso de uso deve ter arquivo de teste correspondente

## Frontend Angular — Padrões

### Configuração
- Angular 21, standalone components (sem NgModules)
- Signals para estado reativo (`signal`, `computed`)
- `provideHttpClient(withInterceptors([authInterceptor]))` no `app.config.ts`
- `provideRouter` com lazy loading em todas as rotas

### Modelos TypeScript
Os modelos em `core/models/usuario.model.ts` usam nomes em português espelhando o domínio C#:
`Usuario`, `Servico`, `Cobranca`, `DadosBancarios`, `MensagemServico`, `EstatisticasAdmin`

### Auth
- `AuthService` em `core/auth/` — `signal<Usuario | null>`, métodos `entrar()`, `cadastrar()`, `sair()`
- `authGuard` — protege `/minha-area` e `/admin`
- `adminGuard` — protege `/admin` (requer `papel === 'admin'`)
- `authInterceptor` — injeta `Authorization: Bearer <token>` em todas as requisições

### Testes
- Cada componente tem arquivo `.spec.ts` obrigatório
- Usar `HttpClientTestingModule` nos testes de serviços HTTP

## Rotas da Aplicação

| Rota | Componente | Guard |
|------|-----------|-------|
| `/` | `HomeComponent` | — |
| `/servicos` | `ServicosComponent` | — |
| `/como-funciona` | `ComoFuncionaComponent` | — |
| `/para-prestadores` | `ParaPrestadoresComponent` | — |
| `/entrar` | `EntrarComponent` | — |
| `/cadastrar` | `CadastrarComponent` | — |
| `/minha-area` | `MinhaAreaComponent` | `authGuard` |
| `/admin` | `AdminComponent` | `authGuard` + `adminGuard` |

## API Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | — | Criar conta |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | Bearer | Perfil do usuário logado |
| GET | `/api/auth/banking` | Bearer | Dados bancários |
| POST | `/api/auth/banking` | Bearer (prestador) | Salvar dados bancários |
| GET | `/api/admin/stats` | Bearer (admin) | Estatísticas gerais |
| GET | `/api/admin/users` | Bearer (admin) | Listar usuários |
| GET | `/api/admin/services` | Bearer (admin) | Listar serviços |
| PATCH | `/api/admin/services/:id` | Bearer (admin) | Atualizar status |
| GET | `/api/admin/services/:id/messages` | Bearer (admin) | Chat do serviço |
| POST | `/api/admin/services/:id/messages` | Bearer (admin) | Enviar mensagem |
| GET | `/api/admin/charges` | Bearer (admin) | Listar cobranças |
| GET | `/healthz` | — | Health check |

## Comandos Úteis

```bash
# Backend
cd backend && dotnet run --project src/Prontto.Api
cd backend && dotnet test tests/Prontto.UnitTests

# Frontend
cd frontend && ng serve
cd frontend && ng test

# Banco (docker)
docker-compose up -d postgres

# Migrations EF Core
cd backend && dotnet ef migrations add <NomeDaMigration> \
  --project src/Prontto.Infrastructure \
  --startup-project src/Prontto.Api
cd backend && dotnet ef database update \
  --project src/Prontto.Infrastructure \
  --startup-project src/Prontto.Api
```

## Regras de Desenvolvimento

1. **Testes unitários são obrigatórios** — toda feature deve ter cobertura de teste
2. **Nunca deletar `attached_assets/`** — contém imagens do projeto
3. **`api-spec/openapi.yaml` é a fonte da verdade** — backend implementa, frontend consome
4. **Valores monetários sempre `decimal`** no C# — nunca `double` ou `float`
5. **Mapeamento de colunas explícito** em `ContextoBancoDados` — não depender de convenção automática
6. **Projetos e pastas em inglês**, **código (classes, variáveis, interfaces) em português**
