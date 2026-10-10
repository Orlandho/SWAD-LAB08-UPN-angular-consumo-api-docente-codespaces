import { HttpInterceptorFn } from '@angular/common/http';
import { ProductoService } from '../services/producto';

export const authInterceptorConfig = {
  esEntornoLocalDev: (): boolean => {
    if (typeof window === 'undefined') return false;
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalHost && Boolean(window.location.port);
  }
};

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
    // Si la aplicación se ejecuta en el navegador web local con el servidor de desarrollo (puerto activo),
    // el backend Spring Boot del docente alojado en Codespaces rechaza el Origin local http://localhost:4200
    // con HTTP 403 (debido a que su CorsRegistry solo autoriza allowedOriginPatterns https://*.app.github.dev).
    // Para consumir la API real sin errores CORS, enrutamos transparentemente la petición a través del
    // proxy de desarrollo (/api/...) definido en proxy.conf.json con changeOrigin: true.
    if (authInterceptorConfig.esEntornoLocalDev()) {
      const urlRelativa = req.url.replace(/^https:\/\/[^/]+\/api/, '/api');
      if (urlRelativa !== req.url) {
        return next(req.clone({ url: urlRelativa }));
      }
    }

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

