import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  apiUrlEdit = '';
  editandoUrl = false;

  readonly DOCENTE_URL = ProductoService.DOCENTE_URL;
  readonly LOCAL_URL = ProductoService.LOCAL_URL;

  constructor(public productoService: ProductoService) {
    this.apiUrlEdit = this.productoService.getUrl();
  }

  toggleEditUrl(): void {
    this.editandoUrl = !this.editandoUrl;
    if (this.editandoUrl) {
      this.apiUrlEdit = this.productoService.getUrl();
    }
  }

  seleccionarPreset(url: string): void {
    this.apiUrlEdit = url;
    this.guardarUrl();
  }

  guardarUrl(): void {
    if (this.apiUrlEdit.trim()) {
      this.productoService.setUrl(this.apiUrlEdit.trim());
      this.editandoUrl = false;
      window.location.reload();
    }
  }

  restablecerPredeterminada(): void {
    this.productoService.restablecerUrlPredeterminada();
    this.apiUrlEdit = this.productoService.getUrl();
    this.editandoUrl = false;
    window.location.reload();
  }

  get tipoBackend(): string {
    const url = this.productoService.getUrl();
    if (url.includes('app.github.dev')) return 'Docente Codespaces';
    if (url.includes('localhost') || url.includes('127.0.0.1')) return 'Localhost :8080';
    return 'Personalizado';
  }
}
