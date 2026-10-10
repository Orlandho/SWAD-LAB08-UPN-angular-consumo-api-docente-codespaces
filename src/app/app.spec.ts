import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

describe('App Root Component (SWAD Lab 08 V3)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente e inicializar totalProductos y totalStockBajo en 0', () => {
    expect(component).toBeTruthy();
    expect(component.totalProductos).toBe(0);
    expect(component.totalStockBajo).toBe(0);
  });

  it('debe renderizar el componente encabezado con titulo de catalogo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-encabezado')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
