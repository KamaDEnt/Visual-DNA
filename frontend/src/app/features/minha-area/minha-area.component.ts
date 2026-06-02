import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { BankingService } from '../../core/api/banking.service';
import { DadosBancarios } from '../../core/models/usuario.model';

@Component({
  selector: 'app-minha-area',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './minha-area.component.html',
  styleUrl: './minha-area.component.scss',
})
export class MinhaAreaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly bankingService = inject(BankingService);

  readonly usuario = this.auth.usuario;
  readonly dadosBancarios = signal<DadosBancarios | null>(null);
  readonly salvando = signal(false);
  readonly mensagem = signal<string | null>(null);

  readonly formularioBanking = this.fb.group({
    tipoChavePix: ['cpf'],
    chavePix: [''],
    nomeCompleto: [''],
    cpfCnpj: [''],
    nomeBanco: [''],
    agencia: [''],
    numeroConta: [''],
    tipoConta: [''],
  });

  ngOnInit(): void {
    if (this.usuario()?.tipoConta === 'prestador') {
      this.bankingService.obterDadosBancarios().subscribe({
        next: (res) => {
          this.dadosBancarios.set(res.banking);
          if (res.banking) {
            this.formularioBanking.patchValue({
              tipoChavePix: res.banking.tipoChavePix,
              chavePix: res.banking.chavePix,
              nomeCompleto: res.banking.nomeCompleto,
              cpfCnpj: res.banking.cpfCnpj,
              nomeBanco: res.banking.nomeBanco ?? '',
              agencia: res.banking.agencia ?? '',
              numeroConta: res.banking.numeroConta ?? '',
              tipoConta: res.banking.tipoConta ?? '',
            });
          }
        },
      });
    }
  }

  salvarBanking(): void {
    this.salvando.set(true);
    this.bankingService.salvarDadosBancarios(this.formularioBanking.value as any).subscribe({
      next: (res) => {
        this.dadosBancarios.set(res.banking);
        this.mensagem.set('Dados bancários salvos com sucesso!');
        this.salvando.set(false);
      },
      error: () => {
        this.mensagem.set('Erro ao salvar dados bancários.');
        this.salvando.set(false);
      },
    });
  }

  sair(): void {
    this.auth.sair();
  }
}
