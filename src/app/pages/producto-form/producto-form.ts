import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.scss']
})
export class ProductoForm implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);

  id?: number;
  editando = false;
  mensaje = '';
  guardando = false;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01), Validators.max(50000)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const valor = this.route.snapshot.paramMap.get('id');
    if (valor) {
      this.id = Number(valor);
      this.editando = true;
      this.productoService.buscarPorId(this.id).subscribe({
        next: p => {
          this.form.patchValue({
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock
          });
          this.cdr.markForCheck();
        },
        error: err => {
          this.mensaje = `Error al cargar producto (HTTP ${err?.status ?? '404'}): recurso no encontrado`;
          this.cdr.markForCheck();
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    const producto = this.form.getRawValue();

    const peticion = this.editando && this.id
      ? this.productoService.actualizar(this.id, producto)
      : this.productoService.registrar(producto);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.cdr.markForCheck();
        this.router.navigate(['/productos']);
      },
      error: err => {
        this.guardando = false;
        this.mensaje = `Error al guardar en backend: HTTP ${err?.status ?? 'Fallo'}`;
        this.cdr.markForCheck();
      }
    });
  }
}
