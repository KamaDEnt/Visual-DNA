import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

interface RespostaAuth {
  token: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _usuario = signal<Usuario | null>(this.carregarUsuarioLocal());
  private readonly _token = signal<string | null>(localStorage.getItem('prontto_token'));

  readonly usuario = this._usuario.asReadonly();
  readonly estaAutenticado = computed(() => this._usuario() !== null);
  readonly ehAdmin = computed(() => this._usuario()?.papel === 'admin');

  entrar(email: string, senha: string) {
    return this.http
      .post<RespostaAuth>(`${environment.apiUrl}/api/auth/login`, { email, password: senha })
      .pipe(tap(resposta => this.salvarSessao(resposta)));
  }

  cadastrar(dados: {
    nome: string; email: string; senha: string;
    tipoConta: string; telefone?: string; especialidade?: string; cidade?: string;
  }) {
    return this.http
      .post<RespostaAuth>(`${environment.apiUrl}/api/auth/register`, {
        name: dados.nome, email: dados.email, password: dados.senha,
        accountType: dados.tipoConta, phone: dados.telefone,
        specialty: dados.especialidade, city: dados.cidade,
      })
      .pipe(tap(resposta => this.salvarSessao(resposta)));
  }

  sair(): void {
    localStorage.removeItem('prontto_token');
    localStorage.removeItem('prontto_usuario');
    this._token.set(null);
    this._usuario.set(null);
  }

  obterToken(): string | null {
    return this._token();
  }

  private salvarSessao(resposta: RespostaAuth): void {
    const usuario = this.mapearUsuario(resposta.user);
    localStorage.setItem('prontto_token', resposta.token);
    localStorage.setItem('prontto_usuario', JSON.stringify(usuario));
    this._token.set(resposta.token);
    this._usuario.set(usuario);
  }

  private carregarUsuarioLocal(): Usuario | null {
    const dados = localStorage.getItem('prontto_usuario');
    return dados ? JSON.parse(dados) : null;
  }

  private mapearUsuario(dados: any): Usuario {
    return {
      id: dados.id,
      nome: dados.name,
      email: dados.email,
      telefone: dados.phone,
      tipoConta: dados.accountType,
      papel: dados.role,
      especialidade: dados.specialty,
      cidade: dados.city,
      criadoEm: dados.createdAt,
    };
  }
}
