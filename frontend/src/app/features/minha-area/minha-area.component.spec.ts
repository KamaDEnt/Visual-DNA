import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MinhaAreaComponent } from './minha-area.component';

describe('MinhaAreaComponent', () => {
  let componente: MinhaAreaComponent;
  let fixture: ComponentFixture<MinhaAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaAreaComponent, ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaAreaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('não deve exibir formulário bancário para clientes', () => {
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelector('.dados-bancarios')).toBeNull();
  });
});
