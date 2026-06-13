import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfilPrestadorService } from '../../core/api/perfil-prestador.service';
import { AuthService } from '../../core/auth/auth.service';
import { PerfilPublico } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-prestador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-prestador.component.html',
  styleUrl: './perfil-prestador.component.scss',
})
export class PerfilPrestadorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly perfilService = inject(PerfilPrestadorService);
  readonly auth = inject(AuthService);

  readonly perfil = signal<PerfilPublico | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.perfilService.obterPerfilPublico(slug).subscribe({
      next: (dados) => {
        this.perfil.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        this.carregando.set(false);
        if (err.status === 404) {
          this.erro.set('Prestador não encontrado.');
        } else {
          this.erro.set('Ocorreu um erro ao carregar o perfil. Tente novamente.');
        }
      },
    });
  }

  readonly mensagemContratacao = signal<string | null>(null);

  contratar(): void {
    const usuario = this.auth.usuario();

    if (!usuario) {
      const returnUrl = this.router.url;
      this.router.navigate(['/entrar'], { queryParams: { returnUrl } });
      return;
    }

    if (usuario.tipoConta === 'prestador') {
      this.mensagemContratacao.set('Prestadores não podem contratar serviços.');
      setTimeout(() => this.mensagemContratacao.set(null), 4000);
      return;
    }

    // Cliente — navega para criação de serviço com prestador pré-selecionado
    const p = this.perfil();
    if (!p) return;

    this.router.navigate(['/servicos/novo'], {
      queryParams: {
        prestadorId: p.slug ?? p.id,
        prestadorNome: encodeURIComponent(p.nome),
      },
    });
  }

  get estrelas(): number[] {
    const media = Math.round(this.perfil()?.mediaAvaliacoes ?? 0);
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  estralaAtiva(index: number): boolean {
    return index <= Math.round(this.perfil()?.mediaAvaliacoes ?? 0);
  }
}
