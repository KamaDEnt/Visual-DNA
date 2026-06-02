import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">Prontto</a>
      <div class="links">
        <a routerLink="/servicos">Serviços</a>
        <a routerLink="/como-funciona">Como funciona</a>
        <a routerLink="/para-prestadores">Para prestadores</a>
        @if (auth.estaAutenticado()) {
          <a routerLink="/minha-area">Minha Área</a>
          @if (auth.ehAdmin()) {
            <a routerLink="/admin">Admin</a>
          }
          <button (click)="auth.sair()">Sair</button>
        } @else {
          <a routerLink="/entrar">Entrar</a>
          <a routerLink="/cadastrar" class="btn-cadastrar">Cadastrar</a>
        }
      </div>
    </nav>

    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 100;
    }
    .logo { font-weight: 800; font-size: 1.5rem; color: #1a56db; text-decoration: none; }
    .links { display: flex; gap: 1.5rem; align-items: center; }
    .links a { text-decoration: none; color: #374151; font-weight: 500; }
    .links button { background: none; border: none; cursor: pointer; font-weight: 500; color: #dc2626; }
    .btn-cadastrar { background: #1a56db; color: #fff !important; padding: 0.5rem 1.25rem; border-radius: 0.5rem; }
    main { min-height: calc(100vh - 65px); }
  `],
})
export class App {
  readonly auth = inject(AuthService);
}
