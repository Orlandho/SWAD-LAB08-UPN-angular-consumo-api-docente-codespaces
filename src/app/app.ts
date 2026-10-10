import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Encabezado } from './components/encabezado/encabezado';
import { ProductoService } from './services/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Encabezado],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  public productoService = inject(ProductoService);
  totalProductos = 0;
  totalStockBajo = 0;

  reintentarDocente(): void {
    this.productoService.probarApiDocente();
    window.location.reload();
  }

  cerrarAviso(): void {
    this.productoService.avisoFalloDocente.set(null);
  }
}
