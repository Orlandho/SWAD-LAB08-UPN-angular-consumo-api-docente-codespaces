import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductoService } from './producto';
import { Producto } from '../models/producto';

describe('ProductoService (SWAD Lab 08)', () => {
  let service: ProductoService;
  let httpTesting: HttpTestingController;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Laptop Lenovo', precio: 2500, stock: 10, estadoStock: 'OK' },
    { id: 2, nombre: 'Mouse Logitech', precio: 80, stock: 3, estadoStock: 'INSUFICIENTE' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductoService
      ]
    });

    service = TestBed.inject(ProductoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('listar() debe enviar petición GET y retornar colección de productos', () => {
    service.listar().subscribe(productos => {
      expect(productos.length).toBe(2);
      expect(productos[0].nombre).toBe('Laptop Lenovo');
      expect(productos[1].estadoStock).toBe('INSUFICIENTE');
    });

    const req = httpTesting.expectOne(service.getUrl());
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('buscarPorId() debe enviar GET con identificador en ruta', () => {
    service.buscarPorId(1).subscribe(p => {
      expect(p.id).toBe(1);
      expect(p.nombre).toBe('Laptop Lenovo');
    });

    const req = httpTesting.expectOne(`${service.getUrl()}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos[0]);
  });

  it('registrar() debe enviar petición POST con payload JSON', () => {
    const nuevo: Producto = { nombre: 'Teclado Gamer', precio: 150, stock: 8 };

    service.registrar(nuevo).subscribe(p => {
      expect(p.id).toBe(3);
      expect(p.nombre).toBe('Teclado Gamer');
    });

    const req = httpTesting.expectOne(service.getUrl());
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevo);
    req.flush({ ...nuevo, id: 3, estadoStock: 'OK' });
  });

  it('actualizar() debe enviar petición PUT a la URL con id', () => {
    const editado: Producto = { id: 1, nombre: 'Laptop Lenovo Pro', precio: 2800, stock: 12 };

    service.actualizar(1, editado).subscribe(p => {
      expect(p.nombre).toBe('Laptop Lenovo Pro');
    });

    const req = httpTesting.expectOne(`${service.getUrl()}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(editado);
    req.flush(editado);
  });

  it('eliminar() debe enviar petición DELETE con id en ruta', () => {
    service.eliminar(2).subscribe();

    const req = httpTesting.expectOne(`${service.getUrl()}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('buscarPorNombre() debe enviar GET con Query Param ?nombre=', () => {
    service.buscarPorNombre('Mouse').subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpTesting.expectOne(`${service.getUrl()}/buscar?nombre=Mouse`);
    expect(req.request.method).toBe('GET');
    req.flush([mockProductos[1]]);
  });
});
