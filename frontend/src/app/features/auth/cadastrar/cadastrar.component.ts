import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss',
})
export class CadastrarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly roteador = inject(Router);

  readonly formulario = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    tipoConta: ['cliente', Validators.required],
    telefone: [''],
    especialidade: [''],
    cidade: [''],
  });

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly ehPrestador = signal(false);

  onTipoContaMudou(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.ehPrestador.set(valor === 'prestador');
  }

  cadastrar(): void {
    if (this.formulario.invalid) return;

    const { nome, email, senha, tipoConta, telefone, especialidade, cidade } = this.formulario.value;
    this.carregando.set(true);
    this.erro.set(null);

    this.auth.cadastrar({
      nome: nome!, email: email!, senha: senha!, tipoConta: tipoConta!,
      telefone: telefone ?? undefined, especialidade: especialidade ?? undefined, cidade: cidade ?? undefined,
    }).subscribe({
      next: () => this.roteador.navigate(['/minha-area']),
      error: (resposta) => {
        this.erro.set(resposta.error?.error ?? 'Erro ao cadastrar');
        this.carregando.set(false);
      },
    });
  }
}
