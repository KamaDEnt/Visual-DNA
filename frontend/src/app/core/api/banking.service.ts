import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DadosBancarios } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class BankingService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/auth`;

  obterDadosBancarios() {
    return this.http.get<{ banking: DadosBancarios | null }>(`${this.base}/banking`);
  }

  salvarDadosBancarios(dados: Partial<DadosBancarios>) {
    return this.http.post<{ banking: DadosBancarios }>(`${this.base}/banking`, {
      pixKeyType: dados.tipoChavePix,
      pixKey: dados.chavePix,
      fullName: dados.nomeCompleto,
      cpfCnpj: dados.cpfCnpj,
      bankName: dados.nomeBanco,
      agency: dados.agencia,
      accountNumber: dados.numeroConta,
      bankAccountType: dados.tipoConta,
    });
  }
}
