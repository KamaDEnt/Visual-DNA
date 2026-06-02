import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="text-align:center; padding:5rem 1rem">
      <h1>404</h1>
      <p>Página não encontrada</p>
      <a routerLink="/">Voltar ao início</a>
    </div>
  `,
})
export class NotFoundComponent {}
