import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Categoria {
  titulo: string;
  icone: string;
  descricao: string;
}

interface Passo {
  label: string;
  titulo: string;
  descricao: string;
  icone: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly passoAtivo = signal(0);

  readonly passos: Passo[] = [
    {
      label: 'O PROBLEMA',
      titulo: 'Algo quebrou em casa?',
      descricao:
        'Vazamentos, elétrica, limpeza ou montagem — imprevistos acontecem. A pergunta é: quem você vai chamar?',
      icone: '🏠',
    },
    {
      label: 'A SOLUÇÃO',
      titulo: 'Encontre o profissional certo',
      descricao:
        'No Prontto, você acessa centenas de profissionais verificados prontos para te atender.',
      icone: '🔍',
    },
    {
      label: 'A CHEGADA',
      titulo: 'Agendado em minutos',
      descricao:
        'Compare perfis, leia avaliações reais e agende com quem você confia.',
      icone: '📅',
    },
    {
      label: 'O RESULTADO',
      titulo: 'Problema resolvido',
      descricao:
        'Serviço feito, avaliação enviada. Tudo simples, tudo no Prontto.',
      icone: '✅',
    },
  ];

  readonly categorias: Categoria[] = [
    { titulo: 'Limpeza', icone: '🧹', descricao: 'Limpeza residencial e comercial' },
    { titulo: 'Encanamento', icone: '🔧', descricao: 'Reparos e instalações hidráulicas' },
    { titulo: 'Elétrica', icone: '⚡', descricao: 'Instalações e reparos elétricos' },
    { titulo: 'Pintura', icone: '🎨', descricao: 'Pintura interna e externa' },
    { titulo: 'Jardinagem', icone: '🌱', descricao: 'Cuidados com jardim e áreas externas' },
    { titulo: 'Mudança', icone: '📦', descricao: 'Transporte e mudanças residenciais' },
  ];

  readonly passoAtualDados = computed(() => this.passos[this.passoAtivo()]);

  selecionarPasso(index: number): void {
    this.passoAtivo.set(index);
  }
}
