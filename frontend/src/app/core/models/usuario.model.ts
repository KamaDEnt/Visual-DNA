export type TipoContaUsuario = 'cliente' | 'prestador';
export type PapelUsuario = 'user' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  tipoConta: TipoContaUsuario;
  papel: PapelUsuario;
  especialidade?: string | null;
  cidade?: string | null;
  criadoEm: string;
}

export interface DadosBancarios {
  id: string;
  usuarioId: string;
  tipoChavePix: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  chavePix: string;
  nomeCompleto: string;
  cpfCnpj: string;
  nomeBanco?: string | null;
  agencia?: string | null;
  numeroConta?: string | null;
  tipoConta?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Servico {
  id: string;
  titulo: string;
  descricao?: string | null;
  categoria: string;
  clienteId?: string | null;
  prestadorId?: string | null;
  preco: string;
  taxaAdminRate: string;
  status: StatusServico;
  endereco?: string | null;
  agendadoEm?: string | null;
  concluidoEm?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  cliente?: { nome: string; email: string } | null;
  prestador?: { nome: string; email: string } | null;
}

export type StatusServico = 'pending_approval' | 'in_progress' | 'completed' | 'cancelled';

export interface Cobranca {
  id: string;
  servicoId: string;
  valorTotal: string;
  taxaAdmin: string;
  valorPrestador: string;
  status: 'pending' | 'paid' | 'refunded';
  pagadoEm?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  servico?: { titulo: string; categoria: string; clienteId?: string | null; prestadorId?: string | null } | null;
}

export interface MensagemServico {
  id: string;
  servicoId: string;
  remetenteId?: string | null;
  papelRemetente: 'client' | 'provider' | 'admin';
  nomeRemetente: string;
  conteudo: string;
  criadoEm: string;
}

export interface EstatisticasAdmin {
  usuarios: { total: number; clientes: number; prestadores: number };
  servicos: { total: number; pendentes: number; emAndamento: number; concluidos: number };
  receita: { ganha: number; pendente: number; gmv: number };
}
