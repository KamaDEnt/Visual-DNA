import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServicosComponent } from './servicos.component';

describe('ServicosComponent', () => {
  let componente: ServicosComponent;
  let fixture: ComponentFixture<ServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicosComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve exibir as 6 categorias', () => {
    expect(componente.categorias.length).toBe(6);
    const elemento: HTMLElement = fixture.nativeElement;
    const cartoes = elemento.querySelectorAll('.card-categoria');
    expect(cartoes.length).toBe(6);
  });
});
