import { Component, input } from '@angular/core';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  templateUrl: './encabezado.html',
  styleUrls: ['./encabezado.scss']
})
export class Encabezado {
  readonly titulo = input.required<string>();
  readonly totalProductos = input<number>(0);
  readonly totalStockBajo = input<number>(0);
}
