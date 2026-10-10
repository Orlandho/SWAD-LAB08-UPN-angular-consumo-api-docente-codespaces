import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Catalogo } from './catalogo';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

describe('Catalogo Component (SWAD Lab 08 V3)', () => {
  let component: Catalogo;
  let fixture: ComponentFixture<Catalogo>;
  let productoService: ProductoService;

  const mockLista: Producto[] = [
    { id: 1, nombre: 'Laptop Lenovo', precio: 2500, stock: 10, estadoStock: 'OK' },
    { id: 2, nombre: 'Mouse Logitech', precio: 80, stock: 3, estadoStock: 'INSUFICIENTE' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogo],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ProductoService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Catalogo);
    component = fixture.componentInstance;
    productoService = TestBed.inject(ProductoService);
  });

  it('debe inicializarse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.productos()).toEqual([]);
  });

  it('cargarProductos() debe actualizar la señal de productos al resolver el servicio', () => {
    // @ts-ignore
    productoService.listar = () => of(mockLista);

    component.cargarProductos();

    expect(component.productos().length).toBe(2);
    expect(component.cargando()).toBe(false);
    expect(component.error()).toBe('');
  });

  it('cargarProductos() debe capturar error HTTP y reflejarlo en la señal error', () => {
    // @ts-ignore
    productoService.listar = () => throwError(() => ({ status: 500, message: 'Internal Server Error' }));

    component.cargarProductos();

    expect(component.productos().length).toBe(0);
    expect(component.cargando()).toBe(false);
    expect(component.error()).toContain('Error HTTP: 500');
  });

  it('cargarProductos() debe actualizar métricas en App shell si está presente en el árbol', () => {
    const mockApp = { totalProductos: 0, totalStockBajo: 0 } as any;
    (component as any).app = mockApp;
    // @ts-ignore
    productoService.listar = () => of(mockLista);

    component.cargarProductos();

    expect(mockApp.totalProductos).toBe(2);
    expect(mockApp.totalStockBajo).toBe(1);
  });
});
