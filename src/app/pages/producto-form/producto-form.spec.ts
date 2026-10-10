import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { ProductoForm } from './producto-form';
import { ProductoService } from '../../services/producto';

describe('ProductoForm Component (SWAD Lab 08)', () => {
  let component: ProductoForm;
  let fixture: ComponentFixture<ProductoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        },
        ProductoService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse en modo nuevo por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.editando).toBe(false);
    expect(component.form.valid).toBe(false);
  });

  it('debe validar que nombre requiera minimo 3 caracteres y precio sea mayor a 0', () => {
    component.form.patchValue({
      nombre: 'Ab',
      precio: 0,
      stock: -1
    });

    expect(component.form.controls.nombre.valid).toBe(false);
    expect(component.form.controls.precio.valid).toBe(false);
    expect(component.form.controls.stock.valid).toBe(false);

    component.form.patchValue({
      nombre: 'Monitor Gamer 27',
      precio: 1200.50,
      stock: 10
    });

    expect(component.form.valid).toBe(true);
  });
});
