import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

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
});
