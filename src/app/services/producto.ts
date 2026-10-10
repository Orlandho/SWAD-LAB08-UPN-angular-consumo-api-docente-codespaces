import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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

  public usandoBackendLocal = signal<boolean>(false);
  public avisoFalloDocente = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const guardada = typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
    this.apiUrl = guardada || environment.apiUrl || ProductoService.DOCENTE_URL;
    if (this.apiUrl === ProductoService.LOCAL_URL) {
      this.usandoBackendLocal.set(true);
    }
  }

  getUrl(): string {
    return this.apiUrl;
  }

  esUrlDocente(): boolean {
    return this.apiUrl.includes('github.dev') || this.apiUrl === ProductoService.DOCENTE_URL;
  }

  setUrl(url: string): void {
    const limpia = url.trim();
    if (limpia) {
      this.apiUrl = limpia;
      this.usandoBackendLocal.set(limpia === ProductoService.LOCAL_URL);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, limpia);
      }
    }
  }

  activarBackendLocal(motivo: string): void {
    this.apiUrl = ProductoService.LOCAL_URL;
    this.usandoBackendLocal.set(true);
    this.avisoFalloDocente.set(motivo);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, this.apiUrl);
    }
  }

  probarApiDocente(): void {
    this.apiUrl = ProductoService.DOCENTE_URL;
    this.usandoBackendLocal.set(false);
    this.avisoFalloDocente.set(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, this.apiUrl);
    }
  }

  restablecerUrlPredeterminada(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.apiUrl = environment.apiUrl || ProductoService.DOCENTE_URL;
    this.usandoBackendLocal.set(this.apiUrl === ProductoService.LOCAL_URL);
    this.avisoFalloDocente.set(null);
  }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        if (this.esUrlDocente() && (err.status === 0 || err.status === 403 || err.status >= 500)) {
          const mensajeDetalle = err.status === 0
            ? 'La API del profesor en GitHub Codespaces no responde o fue bloqueada por la política CORS del navegador (Error HTTP: 0).'
            : `La API del profesor en GitHub Codespaces devolvió Error HTTP: ${err.status}.`;
          this.activarBackendLocal(
            `${mensajeDetalle} Se activó automáticamente el backend local de respaldo en ${ProductoService.LOCAL_URL} para que puedas probar el catálogo y todas las operaciones CRUD.`
          );
          return this.http.get<Producto[]>(this.apiUrl);
        }
        return throwError(() => err);
      })
    );
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
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (this.esUrlDocente() && (err.status === 0 || err.status === 403 || err.status >= 500)) {
          this.activarBackendLocal(
            `La API del profesor no respondió (Error HTTP: ${err.status}). Se está usando el backend local en ${ProductoService.LOCAL_URL}.`
          );
          return this.http.get<Producto[]>(`${this.apiUrl}/buscar`, {
            params: { nombre }
          });
        }
        return throwError(() => err);
      })
    );
  }
}
