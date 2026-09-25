// Bollicine offline support: the guest app, its code, fonts and bottle images are kept on the phone.
const CACHE = "bollicine-v1";
const WINES = ["audace-photo", "bio", "chardonnay", "frizzante", "ice", "medea", "soe", "valdobbiadene", "zero"];
const PRECACHE = ["/app", "/manifest.webmanifest", "/icon-192.png", ...WINES.map((w) => `/wines/${w}.webp`)];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  const store = (res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  };

  // Pages: fresh when online, cached when not.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(store)
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/app"))),
    );
    return;
  }
  // Code, fonts, images: file names are content-hashed or stable, so the cache wins.
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then(store)));
});
