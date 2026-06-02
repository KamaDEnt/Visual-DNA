import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.scss',
})
export class ComoFuncionaComponent {
  readonly passos = [
    { numero: 1, titulo: 'Escolha o serviço', descricao: 'Navegue pelas categorias e encontre o que você precisa.' },
    { numero: 2, titulo: 'Solicite um orçamento', descricao: 'Descreva o serviço e receba propostas de profissionais.' },
    { numero: 3, titulo: 'Aprove e agende', descricao: 'Escolha a melhor proposta e agende no horário conveniente.' },
    { numero: 4, titulo: 'Serviço realizado', descricao: 'O profissional realiza o serviço e você paga com segurança.' },
  ];
}
