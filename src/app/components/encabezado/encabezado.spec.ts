import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { Encabezado } from './encabezado';

describe('Encabezado Component (SWAD Lab 08 V3)', () => {
  let component: Encabezado;
  let componentRef: ComponentRef<Encabezado>;
  let fixture: ComponentFixture<Encabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encabezado]
    }).compileComponents();

    fixture = TestBed.createComponent(Encabezado);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('titulo', 'Catálogo de productos');
    componentRef.setInput('totalProductos', 5);
    fixture.detectChanges();
  });

  it('debe crearse correctamente con inputs requeridos', () => {
    expect(component).toBeTruthy();
    expect(component.titulo()).toBe('Catálogo de productos');
    expect(component.totalProductos()).toBe(5);
  });

  it('debe renderizar el titulo y contador en el DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Catálogo de productos');
    expect(compiled.textContent).toContain('5 productos en catálogo');
  });
});
