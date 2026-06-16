// sw.js — Organiza2 Service Worker
// Estrategia: cache-first para el shell local, network-only para Firebase
// Fase 39 — Junio 2026

const CACHE_NAME = 'organiza2-v2-3';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './css/base.css',
  './css/login.css',
  './css/finanzas.css',
  './css/presupuesto.css',
  './js/config.js',
  './js/utils.js',
  './js/offline.js',
  './js/firebase-paths.js',
  './js/auth.js',
  './js/telemetria.js',
  './js/hogar.js',
  './js/finanzas.js',
  './js/presupuesto.js',
  './js/daily.js',
  './js/analisis.js',
  './js/ui.js',
  './js/app.js'
];

// Hosts que siempre van a red — nunca cachear
const NETWORK_ONLY_HOSTS = [
  'firebaseapp.com',
  'googleapis.com',
  'gstatic.com',
  'firebasedatabase.app',
  'identitytoolkit.googleapis.com'
];

// ── INSTALL — precachear el shell ─────────────────────────────────────────────

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE — limpiar caches anteriores ─────────────────────────────────────

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — cache-first para shell, network-only para Firebase ────────────────

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-only: Firebase y CDN externos
  if (NETWORK_ONLY_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Solo interceptar GET
  if (event.request.method !== 'GET') return;

  // Cache-first para el shell
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // No está en cache → red, y guardar para próxima vez
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Sin red y sin cache → devolver index.html como fallback
        return caches.match('./index.html');
      });
    })
  );
});
