import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Encabezado } from './components/encabezado/encabezado';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Encabezado],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  totalProductos = 0;
  totalStockBajo = 0;
}
