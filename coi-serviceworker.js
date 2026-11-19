if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', e => {
    const r = e.request;
    if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
    e.respondWith(fetch(r).then(res => {
      if (res.status === 0) return res;
      const h = new Headers(res.headers);
      h.set('Cross-Origin-Embedder-Policy', 'credentialless');
      h.set('Cross-Origin-Opener-Policy', 'same-origin');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    }).catch(() => fetch(r)));
  });
} else {
  if (!window.crossOriginIsolated && navigator.serviceWorker && !window.__coi) {
    window.__coi = 1;
    navigator.serviceWorker
      .register(new URL('coi-serviceworker.js', location.href), { scope: './' })
      .then(() => location.reload());
  }
}
