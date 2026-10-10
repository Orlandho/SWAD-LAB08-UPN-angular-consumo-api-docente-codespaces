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

  constructor(public productoService: ProductoService) {
    this.apiUrlEdit = this.productoService.getUrl();
  }

  toggleEditUrl(): void {
    this.editandoUrl = !this.editandoUrl;
    if (this.editandoUrl) {
      this.apiUrlEdit = this.productoService.getUrl();
    }
  }

  guardarUrl(): void {
    if (this.apiUrlEdit.trim()) {
      this.productoService.setUrl(this.apiUrlEdit.trim());
      this.editandoUrl = false;
      window.location.reload();
    }
  }
}
