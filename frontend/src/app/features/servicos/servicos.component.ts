import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss',
})
export class ServicosComponent {
  readonly categorias = [
    { titulo: 'Limpeza', icone: '🧹', descricao: 'Limpeza residencial e comercial' },
    { titulo: 'Encanamento', icone: '🔧', descricao: 'Reparos e instalações hidráulicas' },
    { titulo: 'Elétrica', icone: '⚡', descricao: 'Instalações e reparos elétricos' },
    { titulo: 'Pintura', icone: '🎨', descricao: 'Pintura interna e externa' },
    { titulo: 'Jardinagem', icone: '🌱', descricao: 'Cuidados com jardim e áreas externas' },
    { titulo: 'Mudança', icone: '📦', descricao: 'Transporte e mudanças residenciais' },
  ];
}
