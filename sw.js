
/ ==========================================
// SERVICE WORKER - RULETA PWA
// Actualización automática de archivos
// ==========================================

const CACHE_NAME = "ruleta-pwa-v38";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",

    // Imágenes principales
    "./fondo.jpg",
    "./ruleta.png",
    "./flecharuleta.png",
    "./panel.png",
    "./instalar.png",

    // Botones
    "./boton1.png",
    "./boton2.png",
    "./boton3.png",
    "./boton4.png",
    "./boton5.png",
    "./boton6.png",
    "./boton7.png",

    // Premios
    "./premio1.png",
    "./premio2.png",
    "./premio3.png",
    "./premio4.png",
    "./premio5.png",
    "./premio6.png",
    "./premio7.png",

    // Audio
    "./inicioaudio.mp3"
];

// ==========================================
// INSTALAR NUEVA VERSIÓN
// ==========================================

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                // Guarda los archivos disponibles.
                // Un recurso faltante no debe impedir
                // instalar la nueva versión.
                await Promise.all(
                    ARCHIVOS.map(async (archivo) => {
                        try {
                            const respuesta = await fetch(archivo, {
                                cache: "reload"
                            });

                            if (respuesta.ok) {
                                await cache.put(archivo, respuesta);
                            } else {
                                console.warn(
                                    "No se pudo actualizar:",
                                    archivo,
                                    respuesta.status
                                );
                            }
                        } catch (error) {
                            console.warn(
                                "Error al guardar:",
                                archivo,
                                error
                            );
                        }
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

// ==========================================
// ACTIVAR Y ELIMINAR CACHÉS ANTIGUAS
// ==========================================

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((nombresCache) => {
                return Promise.all(
                    nombresCache
                        .filter((nombre) =>
                            nombre.startsWith("ruleta-pwa-") &&
                            nombre !== CACHE_NAME
                        )
                        .map((nombre) => caches.delete(nombre))
                );
            })
            .then(() => self.clients.claim())
    );
});

// ==========================================
// INTERCEPTAR PETICIONES
// ==========================================

self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Solo peticiones GET
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // No interceptar otros dominios
    if (url.origin !== self.location.origin) {
        return;
    }

    // HTML, CSS, JS y JSON:
    // servidor primero para obtener cambios recientes.
    const esArchivoActualizable =
        request.mode === "navigate" ||
        /\.(html|css|js|json)$/i.test(url.pathname);

    if (esArchivoActualizable) {
        event.respondWith(
            fetch(request, { cache: "no-cache" })
                .then(async (respuesta) => {
                    if (respuesta.ok) {
                        const copia = respuesta.clone();

                        try {
                            const cache = await caches.open(CACHE_NAME);
                            await cache.put(request, copia);
                        } catch (error) {
                            console.warn(
                                "No se pudo actualizar la caché:",
                                error
                            );
                        }
                    }

                    return respuesta;
                })
                .catch(async () => {
                    // Si no hay internet, usar la caché.
                    const cache = await caches.open(CACHE_NAME);

                    return (
                        await cache.match(request) ||
                        await cache.match("./index.html") ||
                        Response.error()
                    );
                })
        );

        return;
    }

    // Imágenes y audio:
    // caché primero para una carga más rápida.
    event.respondWith(
        caches.match(request)
            .then((respuestaCache) => {
                if (respuestaCache) {
                    return respuestaCache;
                }

                return fetch(request).then(async (respuesta) => {
                    if (respuesta.ok) {
                        const copia = respuesta.clone();

                        try {
                            const cache = await caches.open(CACHE_NAME);
                            await cache.put(request, copia);
                        } catch (error) {
                            console.warn(
                                "No se pudo guardar el recurso:",
                                error
                            );
                        }
                    }

                    return respuesta;
                });
            })
    );
});
