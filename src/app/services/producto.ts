import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public static readonly DOCENTE_URL =
    'https://glorious-spork-747q6qvw9g4hr5x7-8080.app.github.dev/api/productos';
  public static readonly LOCAL_URL = 'http://localhost:8080/api/productos';
  private readonly STORAGE_KEY = 'swad_lab08_api_url';

  private apiUrl: string;

  constructor(private http: HttpClient) {
    const guardada = typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
    this.apiUrl = guardada || environment.apiUrl || ProductoService.DOCENTE_URL;
  }

  getUrl(): string {
    return this.apiUrl;
  }

  setUrl(url: string): void {
    const limpia = url.trim();
    if (limpia) {
      this.apiUrl = limpia;
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, limpia);
      }
    }
  }

  restablecerUrlPredeterminada(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.apiUrl = environment.apiUrl || ProductoService.DOCENTE_URL;
  }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  registrar(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }
}
