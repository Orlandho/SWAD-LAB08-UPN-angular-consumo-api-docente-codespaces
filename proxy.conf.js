module.exports = {
  '/api': {
    target: 'https://glorious-spork-747q6qvw9g4hr5x7-8080.app.github.dev',
    secure: false,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.removeHeader('origin');
      proxyReq.removeHeader('referer');
    },
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin');
        proxyReq.removeHeader('referer');
      });
    }
  }
};
