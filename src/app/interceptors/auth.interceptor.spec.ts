import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor, authInterceptorConfig } from './auth.interceptor';

describe('authInterceptor (SWAD Lab 08)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe clonar peticion y adjuntar Bearer token si existe en localStorage', () => {
    localStorage.setItem('token', 'jwt-test-token-12345');

    const req = new HttpRequest('GET', '/api/productos');
    let capturedReq: HttpRequest<any> | null = null;
    const next: HttpHandlerFn = (request) => {
      capturedReq = request;
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe();
    expect(capturedReq).not.toBeNull();
    // @ts-ignore
    expect(capturedReq.headers.get('Authorization')).toBe('Bearer jwt-test-token-12345');
  });

  it('no debe modificar cabeceras si no existe token en localStorage', () => {
    const req = new HttpRequest('GET', '/api/productos');
    let capturedReq: HttpRequest<any> | null = null;
    const next: HttpHandlerFn = (request) => {
      capturedReq = request;
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe();
    expect(capturedReq).not.toBeNull();
    // @ts-ignore
    expect(capturedReq.headers.has('Authorization')).toBe(false);
  });

  it('no debe adjuntar token Authorization para la API pública del docente en github.dev para evitar preflight CORS', () => {
    localStorage.setItem('token', 'jwt-test-token-12345');
    const req = new HttpRequest(
      'GET',
      'https://glorious-spork-747q6qvw9g4hr5x7-8080.app.github.dev/api/productos'
    );
    let capturedReq: HttpRequest<any> | null = null;
    const next: HttpHandlerFn = (request) => {
      capturedReq = request;
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe();
    expect(capturedReq).not.toBeNull();
    // @ts-ignore
    expect(capturedReq.headers.has('Authorization')).toBe(false);
  });

  it('debe enrutar hacia el proxy relativo /api/productos si se ejecuta en localhost con puerto activo', () => {
    const spy = vi.spyOn(authInterceptorConfig, 'esEntornoLocalDev').mockReturnValue(true);

    const req = new HttpRequest(
      'GET',
      'https://glorious-spork-747q6qvw9g4hr5x7-8080.app.github.dev/api/productos'
    );
    let capturedReq: HttpRequest<any> | null = null;
    const next: HttpHandlerFn = (request) => {
      capturedReq = request;
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, next).subscribe();
    expect(capturedReq).not.toBeNull();
    // @ts-ignore
    expect(capturedReq.url).toBe('/api/productos');

    spy.mockRestore();
  });
});

