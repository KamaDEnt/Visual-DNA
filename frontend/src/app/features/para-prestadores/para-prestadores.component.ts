import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Beneficio {
  titulo: string;
  descricao: string;
  icone: string;
}

@Component({
  selector: 'app-para-prestadores',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './para-prestadores.component.html',
  styleUrl: './para-prestadores.component.scss',
})
export class ParaPrestadoresComponent {
  readonly beneficios: Beneficio[] = [
    {
      titulo: 'Clientes qualificados',
      descricao: 'Receba solicitações de clientes sérios próximos a você.',
      icone: '👥',
    },
    {
      titulo: 'Pagamento seguro',
      descricao: 'Receba via Pix com segurança após conclusão do serviço.',
      icone: '🔒',
    },
    {
      titulo: 'Avaliações reais',
      descricao: 'Construa sua reputação com avaliações verificadas.',
      icone: '⭐',
    },
    {
      titulo: 'Gestão simplificada',
      descricao: 'Gerencie seus serviços pelo painel do prestador.',
      icone: '📊',
    },
  ];
}
