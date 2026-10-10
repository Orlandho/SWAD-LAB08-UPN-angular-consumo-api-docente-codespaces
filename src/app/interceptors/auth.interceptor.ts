import { HttpInterceptorFn } from '@angular/common/http';
import { ProductoService } from '../services/producto';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Las APIs públicas (como la API docente de GitHub Codespaces) no requieren token de autenticación.
  // Inyectar cabeceras Authorization a endpoints públicos de github.dev genera preflight CORS estricto
  // innecesario que suele provocar bloqueos HTTP 0 o 403 en los navegadores.
  const esApiDocente =
    req.url.includes('github.dev') ||
    req.url.includes('app.github.dev') ||
    req.url === ProductoService.DOCENTE_URL ||
    req.url.startsWith(ProductoService.DOCENTE_URL);

  if (esApiDocente) {
    return next(req);
  }

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return next(req);
  }

  const autenticada = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(autenticada);
};

