// Seeder de dados de teste — Prontto
// Uso: dotnet run [dev|prod]   (padrão: dev)

using MySqlConnector;

var ambiente = args.Length > 0 ? args[0] : "dev";

var connString = ambiente == "prod"
    ? "Server=72.60.122.109;Database=u638238509_PronttoAdm;User=u638238509_PronttoAdm;Password=>r@OeHY0X3;Port=3306;AllowPublicKeyRetrieval=true;SslMode=Required;Connection Timeout=30;"
    : "Server=72.60.122.109;Database=u638238509_prontto_dev;User=u638238509_prontto_dev;Password=^ybtnwO?hPc8;Port=3306;AllowPublicKeyRetrieval=true;SslMode=Required;Connection Timeout=30;";

Console.WriteLine($"╔══════════════════════════════════════════╗");
Console.WriteLine($"║   Prontto — Seeder de Dados de Teste     ║");
Console.WriteLine($"╚══════════════════════════════════════════╝");
Console.WriteLine($"Ambiente: {ambiente.ToUpper()}");
Console.WriteLine("Conectando...");

await using var conn = new MySqlConnection(connString);
await conn.OpenAsync();
Console.WriteLine("Conectado!\n");

string NewId() => Guid.NewGuid().ToString();
string Now() => DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
string Ago(int dias) => DateTime.UtcNow.AddDays(-dias).ToString("yyyy-MM-dd HH:mm:ss");
string Em(int dias) => DateTime.UtcNow.AddDays(dias).ToString("yyyy-MM-dd HH:mm:ss");
string HashSenha(string s) => BCrypt.Net.BCrypt.HashPassword(s, workFactor: 12);

// ─── Categorias ───────────────────────────────────────────────────────────────
Console.WriteLine("▶ Buscando categorias...");
var categorias = new List<(string id, string slug, string nome)>();
await using (var cmd = conn.CreateCommand())
{
    cmd.CommandText = "SELECT id, slug, nome FROM categorias WHERE ativo = 1 ORDER BY ordem_exibicao";
    await using var r = await cmd.ExecuteReaderAsync();
    while (await r.ReadAsync())
        categorias.Add((r.GetGuid("id").ToString(), r.GetString("slug"), r.GetString("nome")));
}
if (categorias.Count == 0) { Console.WriteLine("[ERRO] Nenhuma categoria encontrada. Rode o seeder principal primeiro."); return; }
Console.WriteLine($"  {categorias.Count} categorias encontradas.");

string GetCat(string parcial) =>
    categorias.FirstOrDefault(c => c.slug.Contains(parcial) || c.nome.ToLower().Contains(parcial)).id
    ?? categorias[0].id;

// ─── Cidades ──────────────────────────────────────────────────────────────────
Console.WriteLine("▶ Buscando cidades...");
var cidades = new List<(string id, string slug, string nome)>();
await using (var cmd = conn.CreateCommand())
{
    cmd.CommandText = "SELECT id, slug, nome FROM cidades WHERE ativo = 1";
    await using var r = await cmd.ExecuteReaderAsync();
    while (await r.ReadAsync())
        cidades.Add((r.GetGuid("id").ToString(), r.GetString("slug"), r.GetString("nome")));
}
Console.WriteLine($"  {cidades.Count} cidades encontradas.");

string GetCid(string parcial) =>
    cidades.FirstOrDefault(c => c.slug.Contains(parcial) || c.nome.ToLower().Contains(parcial)).id
    ?? cidades[0].id;

// ─── Usuários ─────────────────────────────────────────────────────────────────
Console.WriteLine("\n▶ Criando usuários...");
var senhaHash = HashSenha("Senha123");
var uids = new Dictionary<string, string>(); // email → id

async Task<string> UpsertUsuario(string nome, string email, string tipo, string papel,
    string? especialidade, string cidParcial, string slug, string? descricao)
{
    await using var chk = conn.CreateCommand();
    chk.CommandText = "SELECT id FROM usuarios WHERE email = @e";
    chk.Parameters.AddWithValue("@e", email);
    var existId = (await chk.ExecuteScalarAsync())?.ToString();
    if (existId != null) { Console.WriteLine($"  [skip] {email}"); return existId; }

    var id = NewId();
    await using var cmd = conn.CreateCommand();
    cmd.CommandText = @"INSERT INTO usuarios
        (id, nome, email, hash_senha, tipo_conta, papel, especialidade, cidade_id,
         slug, descricao, media_avaliacoes, total_avaliacoes, criado_em, atualizado_em)
        VALUES (@id,@nome,@email,@hash,@tipo,@papel,@esp,@cid,@slug,@desc,0.00,0,@now,@now)";
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@nome", nome);
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@hash", senhaHash);
    cmd.Parameters.AddWithValue("@tipo", tipo);
    cmd.Parameters.AddWithValue("@papel", papel);
    cmd.Parameters.AddWithValue("@esp", (object?)especialidade ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@cid", GetCid(cidParcial));
    cmd.Parameters.AddWithValue("@slug", slug);
    cmd.Parameters.AddWithValue("@desc", (object?)descricao ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@now", Now());
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine($"  [ok] {nome} ({tipo})");
    return id;
}

uids["ana.souza@email.com"]        = await UpsertUsuario("Ana Souza",       "ana.souza@email.com",        "Cliente",   "Usuario", null,              "paulo",    "ana-souza",       null);
uids["bruno.lima@email.com"]       = await UpsertUsuario("Bruno Lima",      "bruno.lima@email.com",       "Cliente",   "Usuario", null,              "janeiro",  "bruno-lima",      null);
uids["carla.mendes@email.com"]     = await UpsertUsuario("Carla Mendes",    "carla.mendes@email.com",     "Cliente",   "Usuario", null,              "horizonte","carla-mendes",    null);
uids["mariana.limpeza@email.com"]  = await UpsertUsuario("Mariana Costa",   "mariana.limpeza@email.com",  "Prestador", "Usuario", "Limpeza residencial e comercial", "paulo",    "mariana-costa",   "Especialista em limpeza com 6 anos de experiência. Atendo residências, escritórios e pós-obra.");
uids["joao.encanador@email.com"]   = await UpsertUsuario("João Ferreira",   "joao.encanador@email.com",   "Prestador", "Usuario", "Encanamento e hidráulica",        "janeiro",  "joao-ferreira",   "Encanador com 8 anos de experiência. Conserto de vazamentos, instalações e reformas hidráulicas.");
uids["fernanda.pintura@email.com"] = await UpsertUsuario("Fernanda Alves",  "fernanda.pintura@email.com", "Prestador", "Usuario", "Pintura residencial e comercial", "horizonte","fernanda-alves",  "Pintora profissional. Residencial, comercial, texturas e pinturas decorativas.");

// Carlos já existe — buscar ID
await using (var cmd = conn.CreateCommand())
{
    cmd.CommandText = "SELECT id FROM usuarios WHERE email = 'carlos.eletricista@email.com'";
    var id = (await cmd.ExecuteScalarAsync())?.ToString();
    if (id != null) { uids["carlos.eletricista@email.com"] = id; Console.WriteLine("  [skip] carlos.eletricista@email.com"); }
}

// ─── Dados bancários ──────────────────────────────────────────────────────────
Console.WriteLine("\n▶ Criando dados bancários...");

async Task UpsertDadosBancarios(string email, string tipoChave, string chave, string nome, string cpf)
{
    if (!uids.TryGetValue(email, out var uid)) return;
    await using var chk = conn.CreateCommand();
    chk.CommandText = "SELECT COUNT(*) FROM dados_bancarios WHERE usuario_id = @uid";
    chk.Parameters.AddWithValue("@uid", uid);
    if (Convert.ToInt32(await chk.ExecuteScalarAsync()) > 0) { Console.WriteLine($"  [skip] dados bancários {email}"); return; }

    await using var cmd = conn.CreateCommand();
    cmd.CommandText = @"INSERT INTO dados_bancarios
        (id, usuario_id, tipo_chave_pix, chave_pix, nome_completo, cpf_cnpj, nome_banco, criado_em, atualizado_em)
        VALUES (@id,@uid,@tipo,@chave,@nome,@cpf,'Nubank',@now,@now)";
    cmd.Parameters.AddWithValue("@id", NewId());
    cmd.Parameters.AddWithValue("@uid", uid);
    cmd.Parameters.AddWithValue("@tipo", tipoChave);
    cmd.Parameters.AddWithValue("@chave", chave);
    cmd.Parameters.AddWithValue("@nome", nome);
    cmd.Parameters.AddWithValue("@cpf", cpf);
    cmd.Parameters.AddWithValue("@now", Now());
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine($"  [ok] {email}");
}

await UpsertDadosBancarios("mariana.limpeza@email.com",  "Cpf",      "123.456.789-01",    "Mariana Costa",  "12345678901");
await UpsertDadosBancarios("joao.encanador@email.com",   "Telefone", "+5521999887766",     "João Ferreira",  "98765432100");
await UpsertDadosBancarios("fernanda.pintura@email.com", "Email",    "fernanda@email.com", "Fernanda Alves", "45678912300");
await UpsertDadosBancarios("carlos.eletricista@email.com","Cpf",     "111.222.333-44",     "Carlos Silva",   "11122233344");

// ─── Serviços ─────────────────────────────────────────────────────────────────
Console.WriteLine("\n▶ Criando serviços...");
var sids = new Dictionary<string, string>(); // chave → id

async Task<string?> CriarServico(string chave, string titulo, string desc, string catParcial,
    string cidParcial, string clienteEmail, string? prestadorEmail,
    decimal preco, string status, string endereco, string? agendado = null,
    string? concluido = null, string? aguardandoDesde = null, string? criadoEm = null)
{
    if (!uids.TryGetValue(clienteEmail, out var cliId)) return null;

    await using var chk = conn.CreateCommand();
    chk.CommandText = "SELECT id FROM servicos WHERE titulo = @t AND cliente_id = @c";
    chk.Parameters.AddWithValue("@t", titulo);
    chk.Parameters.AddWithValue("@c", cliId);
    var existId = (await chk.ExecuteScalarAsync())?.ToString();
    if (existId != null) { Console.WriteLine($"  [skip] {titulo}"); sids[chave] = existId; return existId; }

    var preId = prestadorEmail != null && uids.TryGetValue(prestadorEmail, out var pid) ? pid : null;
    var id = NewId();
    var criado = criadoEm ?? Ago(5);

    await using var cmd = conn.CreateCommand();
    cmd.CommandText = @"INSERT INTO servicos
        (id, titulo, descricao, categoria_id, cidade_id, cliente_id, prestador_id, preco,
         taxa_admin_percentual, status, endereco, agendado_em, concluido_em,
         aguardando_confirmacao_desde, criado_em, atualizado_em)
        VALUES (@id,@t,@d,@cat,@cid,@cli,@pre,@preco,0.2000,@status,@end,@agend,@conc,@ag_desde,@criado,@now)";
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@t", titulo);
    cmd.Parameters.AddWithValue("@d", desc);
    cmd.Parameters.AddWithValue("@cat", GetCat(catParcial));
    cmd.Parameters.AddWithValue("@cid", GetCid(cidParcial));
    cmd.Parameters.AddWithValue("@cli", cliId);
    cmd.Parameters.AddWithValue("@pre", (object?)preId ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@preco", preco);
    cmd.Parameters.AddWithValue("@status", status);
    cmd.Parameters.AddWithValue("@end", endereco);
    cmd.Parameters.AddWithValue("@agend", (object?)agendado ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@conc", (object?)concluido ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@ag_desde", (object?)aguardandoDesde ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@criado", criado);
    cmd.Parameters.AddWithValue("@now", Now());
    await cmd.ExecuteNonQueryAsync();
    sids[chave] = id;
    Console.WriteLine($"  [ok] [{status}] {titulo}");
    return id;
}

await CriarServico("limpeza-pendente",     "Limpeza residencial completa",    "Limpeza completa de apartamento de 70m², incluindo banheiros, cozinha e quartos.",                 "limpeza",    "paulo",    "ana.souza@email.com",    "mariana.limpeza@email.com",  180.00m, "Pendente",              "Rua das Flores, 123 - Vila Madalena, SP",   agendado: Em(3),  criadoEm: Ago(1));
await CriarServico("eletrica-aceito",      "Instalação de tomadas e interruptores","Instalar 8 tomadas novas e 4 interruptores em apartamento reformado.",                      "eletrica",   "janeiro",  "bruno.lima@email.com",   "carlos.eletricista@email.com",350.00m, "Aceito",                "Av. Atlântica, 500 - Copacabana, RJ",       agendado: Em(1),  criadoEm: Ago(2));
await CriarServico("encanamento-andamento","Conserto de vazamento na cozinha", "Vazamento embaixo da pia da cozinha, possível problema no sifão e vedação.",                    "encanamento","horizonte","carla.mendes@email.com", "joao.encanador@email.com",   220.00m, "EmAndamento",           "Rua da Bahia, 42 - Centro, BH",             agendado: Now(),  criadoEm: Ago(1));
await CriarServico("pintura-aguardando",   "Pintura de quarto e sala",         "Pintura completa de quarto (15m²) e sala (25m²), duas demãos, cor branco gelo.",                "pintura",    "paulo",    "ana.souza@email.com",    "fernanda.pintura@email.com", 800.00m, "AguardandoConfirmacao", "Rua Pamplona, 88 - Jardins, SP",            agendado: Ago(1), criadoEm: Ago(6), aguardandoDesde: Ago(0));
await CriarServico("limpeza-concluido",    "Limpeza pós-obra",                 "Limpeza pesada após reforma, remoção de entulho, pó de cimento e resíduos de construção.",     "limpeza",    "janeiro",  "bruno.lima@email.com",   "mariana.limpeza@email.com",  450.00m, "Concluido",             "Rua Marquês de Abrantes, 12 - Flamengo, RJ",agendado: Ago(7), criadoEm: Ago(10),concluido: Ago(2));
await CriarServico("eletrica-cancelado",   "Troca de tomadas e disjuntor",     "Trocar 5 tomadas antigas e verificar disjuntor principal do apartamento.",                     "eletrica",   "horizonte","carla.mendes@email.com", "carlos.eletricista@email.com",180.00m, "Cancelado",             "Av. do Contorno, 500 - Savassi, BH",        criadoEm: Ago(15));
await CriarServico("pintura-pendente2",    "Pintura de fachada",               "Pintura da fachada do sobrado, área de aproximadamente 80m². Precisa de andaime.",              "pintura",    "paulo",    "bruno.lima@email.com",   null,                         1200.00m,"Pendente",              "Rua Augusta, 200 - Consolação, SP",         agendado: Em(5),  criadoEm: Ago(0));

// ─── Cobrança para serviço concluído ─────────────────────────────────────────
Console.WriteLine("\n▶ Criando cobranças...");
if (sids.TryGetValue("limpeza-concluido", out var svcConcluido))
{
    await using var chk = conn.CreateCommand();
    chk.CommandText = "SELECT COUNT(*) FROM cobrancas WHERE servico_id = @id";
    chk.Parameters.AddWithValue("@id", svcConcluido);
    if (Convert.ToInt32(await chk.ExecuteScalarAsync()) == 0)
    {
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"INSERT INTO cobrancas
            (id, servico_id, valor_total, taxa_admin, valor_prestador, status, criado_em, atualizado_em)
            VALUES (@id,@svc,450.00,90.00,360.00,'AguardandoPagamento',@now,@now)";
        cmd.Parameters.AddWithValue("@id", NewId());
        cmd.Parameters.AddWithValue("@svc", svcConcluido);
        cmd.Parameters.AddWithValue("@now", Ago(2));
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("  [ok] Cobrança R$450 (taxa R$90 | prestador R$360)");
    }
    else Console.WriteLine("  [skip] cobrança limpeza-concluido já existe");
}

// ─── Mensagens ────────────────────────────────────────────────────────────────
Console.WriteLine("\n▶ Criando mensagens...");

async Task<bool> MensagensExistem(string chave)
{
    if (!sids.TryGetValue(chave, out var sid)) return true;
    await using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT COUNT(*) FROM mensagens_servico WHERE servico_id = @id";
    cmd.Parameters.AddWithValue("@id", sid);
    return Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
}

async Task Msg(string chave, string email, string papel, string conteudo, int minutosAtras = 0)
{
    if (!sids.TryGetValue(chave, out var sid)) return;
    uids.TryGetValue(email, out var remId);
    await using var cmd = conn.CreateCommand();
    cmd.CommandText = @"INSERT INTO mensagens_servico
        (id, servico_id, remetente_id, papel_remetente, tipo_mensagem, conteudo, imagem_moderada, criado_em)
        VALUES (@id,@sid,@rem,@papel,'Texto',@cont,0,@now)";
    cmd.Parameters.AddWithValue("@id", NewId());
    cmd.Parameters.AddWithValue("@sid", sid);
    cmd.Parameters.AddWithValue("@rem", (object?)remId ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@papel", papel);
    cmd.Parameters.AddWithValue("@cont", conteudo);
    cmd.Parameters.AddWithValue("@now", DateTime.UtcNow.AddMinutes(-minutosAtras).ToString("yyyy-MM-dd HH:mm:ss"));
    await cmd.ExecuteNonQueryAsync();
}

if (!await MensagensExistem("eletrica-aceito"))
{
    await Msg("eletrica-aceito", "bruno.lima@email.com",          "Cliente",   "Olá Carlos! Preciso instalar tomadas novas no apartamento reformado. São 8 tomadas e 4 interruptores.", 120);
    await Msg("eletrica-aceito", "carlos.eletricista@email.com",  "Prestador", "Oi Bruno! Consigo fazer sim. O valor de R$350 inclui material e mão de obra. Tudo novo, fio de cobre 2,5mm.", 100);
    await Msg("eletrica-aceito", "bruno.lima@email.com",          "Cliente",   "Perfeito! Pode confirmar para amanhã às 9h? Estarei em casa.", 80);
    await Msg("eletrica-aceito", "carlos.eletricista@email.com",  "Prestador", "Confirmado! Estarei lá às 9h em ponto. Qualquer coisa me chama.", 60);
    Console.WriteLine("  [ok] Mensagens: Instalação elétrica (4)");
}

if (!await MensagensExistem("encanamento-andamento"))
{
    await Msg("encanamento-andamento", "carla.mendes@email.com",      "Cliente",   "João, o vazamento está piorando! Está molhando todo o armário embaixo da pia.", 180);
    await Msg("encanamento-andamento", "joao.encanador@email.com",    "Prestador", "Entendi Carla, pode ser o sifão ou a vedação do cano. Já estou saindo, chego em 20 minutos.", 160);
    await Msg("encanamento-andamento", "joao.encanador@email.com",    "Prestador", "Cheguei! Confirmei que é o sifão mesmo, trincado. Vou trocar agora, tenho a peça na van.", 90);
    await Msg("encanamento-andamento", "carla.mendes@email.com",      "Cliente",   "Ufa! Obrigada pela agilidade João. Fiquei aliviada.", 85);
    Console.WriteLine("  [ok] Mensagens: Conserto de vazamento (4)");
}

if (!await MensagensExistem("pintura-aguardando"))
{
    await Msg("pintura-aguardando", "ana.souza@email.com",         "Cliente",   "Fernanda, qual tinta você está usando? Quero branco gelo mesmo, bem clarinho.", 1440);
    await Msg("pintura-aguardando", "fernanda.pintura@email.com",  "Prestador", "Estou usando Suvinil Premium Ana, é a melhor para interior. Cobre muito bem em duas demãos.", 1420);
    await Msg("pintura-aguardando", "fernanda.pintura@email.com",  "Prestador", "Ana, terminei! Ficou lindo! O quarto e a sala estão impecáveis. Você vai adorar quando chegar.", 30);
    await Msg("pintura-aguardando", "ana.souza@email.com",         "Cliente",   "Que ótimo! Vou passar lá ainda hoje para conferir e confirmar a conclusão.", 20);
    Console.WriteLine("  [ok] Mensagens: Pintura (4)");
}

if (!await MensagensExistem("limpeza-concluido"))
{
    await Msg("limpeza-concluido", "bruno.lima@email.com",         "Cliente",   "Mariana, a reforma terminou mas ficou um caos. Tem cimento, tinta, poeira e entulho.", 2880);
    await Msg("limpeza-concluido", "mariana.limpeza@email.com",    "Prestador", "Entendo Bruno! Pós-obra é pesado mesmo. O valor de R$450 já inclui todos os produtos específicos para isso.", 2860);
    await Msg("limpeza-concluido", "bruno.lima@email.com",         "Cliente",   "Perfeito! Pode começar na segunda-feira às 8h?", 2840);
    await Msg("limpeza-concluido", "mariana.limpeza@email.com",    "Prestador", "Pode deixar! Estarei lá com minha equipe. Estimativa de 6 horas de trabalho.", 2820);
    await Msg("limpeza-concluido", "mariana.limpeza@email.com",    "Prestador", "Trabalho finalizado! O apartamento está impecável. Tirei fotos para o portfolio se você permitir.", 2880 - (2*24*60));
    await Msg("limpeza-concluido", "bruno.lima@email.com",         "Cliente",   "Perfeito Mariana! Ficou incrível, muito obrigado! Pode usar as fotos sim.", 2880 - (2*24*60) - 30);
    Console.WriteLine("  [ok] Mensagens: Limpeza pós-obra (6)");
}

if (!await MensagensExistem("limpeza-pendente"))
{
    await Msg("limpeza-pendente", "ana.souza@email.com",        "Cliente",   "Olá Mariana! Vi seu perfil e achei ótimo. Preciso de limpeza completa do apartamento para o próximo sábado.", 60);
    await Msg("limpeza-pendente", "mariana.limpeza@email.com",  "Prestador", "Oi Ana! Fico feliz! O sábado está disponível sim. O apartamento tem quantos cômodos?", 45);
    await Msg("limpeza-pendente", "ana.souza@email.com",        "Cliente",   "São 2 quartos, 2 banheiros, sala, cozinha e área de serviço. Uns 70m² no total.", 30);
    await Msg("limpeza-pendente", "mariana.limpeza@email.com",  "Prestador", "Perfeito! O valor de R$180 cobre tudo isso. Confirma o pedido para eu bloquear a agenda.", 15);
    Console.WriteLine("  [ok] Mensagens: Limpeza pendente (4)");
}

// ─── Notificações ─────────────────────────────────────────────────────────────
Console.WriteLine("\n▶ Criando notificações...");

async Task<bool> NotifExiste(string email)
{
    if (!uids.TryGetValue(email, out var uid)) return true;
    await using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT COUNT(*) FROM notificacoes WHERE usuario_id = @uid";
    cmd.Parameters.AddWithValue("@uid", uid);
    return Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
}

async Task Notif(string email, string titulo, string mensagem, string tipo, bool lido = false)
{
    if (!uids.TryGetValue(email, out var uid)) return;
    await using var cmd = conn.CreateCommand();
    cmd.CommandText = @"INSERT INTO notificacoes
        (id, usuario_id, titulo, mensagem, lido, tipo, criado_em)
        VALUES (@id,@uid,@titulo,@msg,@lido,@tipo,@now)";
    cmd.Parameters.AddWithValue("@id", NewId());
    cmd.Parameters.AddWithValue("@uid", uid);
    cmd.Parameters.AddWithValue("@titulo", titulo);
    cmd.Parameters.AddWithValue("@msg", mensagem);
    cmd.Parameters.AddWithValue("@lido", lido ? 1 : 0);
    cmd.Parameters.AddWithValue("@tipo", tipo);
    cmd.Parameters.AddWithValue("@now", Now());
    await cmd.ExecuteNonQueryAsync();
}

if (!await NotifExiste("ana.souza@email.com"))
{
    await Notif("ana.souza@email.com", "Serviço aguardando sua confirmação", "Fernanda Alves concluiu a pintura do quarto e sala. Confirme para liberar o pagamento.", "Servico");
    await Notif("ana.souza@email.com", "Mariana respondeu sua mensagem", "Mariana Costa respondeu sobre a limpeza residencial.", "Mensagem", lido: true);
    Console.WriteLine("  [ok] Notificações Ana (2)");
}
if (!await NotifExiste("bruno.lima@email.com"))
{
    await Notif("bruno.lima@email.com", "Cobrança gerada", "Serviço de limpeza pós-obra concluído. Cobrança de R$450,00 aguardando pagamento.", "Cobranca");
    await Notif("bruno.lima@email.com", "Carlos confirmou presença", "Carlos Silva confirmará presença amanhã às 9h para a instalação elétrica.", "Servico", lido: true);
    Console.WriteLine("  [ok] Notificações Bruno (2)");
}
if (!await NotifExiste("carla.mendes@email.com"))
{
    await Notif("carla.mendes@email.com", "João está a caminho", "João Ferreira está a caminho para o conserto de vazamento. Previsão: 20 minutos.", "Servico", lido: true);
    Console.WriteLine("  [ok] Notificações Carla (1)");
}
if (!await NotifExiste("mariana.limpeza@email.com"))
{
    await Notif("mariana.limpeza@email.com", "Novo pedido de serviço", "Ana Souza solicitou limpeza residencial completa para daqui 3 dias. Valor: R$180.", "Servico");
    await Notif("mariana.limpeza@email.com", "Pagamento em processamento", "O pagamento de R$360,00 pelo serviço de limpeza pós-obra está sendo processado.", "Cobranca", lido: true);
    Console.WriteLine("  [ok] Notificações Mariana (2)");
}
if (!await NotifExiste("carlos.eletricista@email.com"))
{
    await Notif("carlos.eletricista@email.com", "Serviço aceito com sucesso", "Você aceitou a instalação elétrica de Bruno Lima. Apareça amanhã às 9h.", "Servico", lido: true);
    Console.WriteLine("  [ok] Notificações Carlos (1)");
}
if (!await NotifExiste("joao.encanador@email.com"))
{
    await Notif("joao.encanador@email.com", "Serviço em andamento", "Conserto de vazamento de Carla Mendes em andamento. Finalize quando concluir.", "Servico", lido: true);
    Console.WriteLine("  [ok] Notificações João (1)");
}
if (!await NotifExiste("fernanda.pintura@email.com"))
{
    await Notif("fernanda.pintura@email.com", "Aguardando confirmação do cliente", "Ana Souza ainda não confirmou a conclusão da pintura. Aguarde ou entre em contato.", "Servico");
    Console.WriteLine("  [ok] Notificações Fernanda (1)");
}

// ─── Resumo ───────────────────────────────────────────────────────────────────
Console.WriteLine(@"
╔══════════════════════════════════════════════════════════════════╗
║                    ✅  Seed concluído!                           ║
╠══════════════════════════════════════════════════════════════════╣
║  Senha de todos os usuários de teste: Senha123                   ║
╠══════════════════════════════════════════════════════════════════╣
║  CLIENTES                                                        ║
║    ana.souza@email.com                                           ║
║    bruno.lima@email.com                                          ║
║    carla.mendes@email.com                                        ║
╠══════════════════════════════════════════════════════════════════╣
║  PRESTADORES                                                     ║
║    mariana.limpeza@email.com    → Limpeza                        ║
║    joao.encanador@email.com     → Encanamento                    ║
║    fernanda.pintura@email.com   → Pintura                        ║
║    carlos.eletricista@email.com → Elétrica                       ║
╠══════════════════════════════════════════════════════════════════╣
║  SERVIÇOS                                                        ║
║    Pendente            Limpeza residencial completa              ║
║    Pendente            Pintura de fachada (sem prestador)        ║
║    Aceito              Instalação de tomadas e interruptores      ║
║    EmAndamento         Conserto de vazamento na cozinha          ║
║    AguardandoConfirm.  Pintura de quarto e sala                  ║
║    Concluido           Limpeza pós-obra + Cobrança gerada        ║
║    Cancelado           Troca de tomadas e disjuntor              ║
╚══════════════════════════════════════════════════════════════════╝");
