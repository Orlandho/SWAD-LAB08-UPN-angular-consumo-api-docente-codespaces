import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.scss']
})
export class Catalogo implements OnInit {

  productos = signal<Producto[]>([]);
  cargando = signal(false);
  error = signal('');
  filtroNombre = signal('');

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.filtroNombre.set(q);
      this.cargarProductos();
    });
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set('');

    const peticion = this.filtroNombre().trim()
      ? this.productoService.buscarPorNombre(this.filtroNombre().trim())
      : this.productoService.listar();

    peticion.subscribe({
      next: (datos: Producto[]) => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: (err: any) => {
        const status = err?.status ?? 'Desconocido';
        const msg = err?.message ?? 'Fallo de comunicacion con el backend';
        this.error.set(`Error HTTP ${status}: ${msg}. Verifique que el backend este activo.`);
        this.cargando.set(false);
      }
    });
  }

  ejecutarBusqueda(): void {
    const q = this.filtroNombre().trim();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q ? q : null },
      queryParamsHandling: 'merge'
    });
  }

  limpiarBusqueda(): void {
    this.filtroNombre.set('');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm(`¿Esta seguro de eliminar el producto con ID ${id}?`)) return;

    this.cargando.set(true);
    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err: any) => {
        this.error.set(`Error al eliminar: HTTP ${err?.status ?? 'Error'}`);
        this.cargando.set(false);
      }
    });
  }
}
