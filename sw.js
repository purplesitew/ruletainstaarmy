// ==========================================
// SERVICE WORKER - RULETA PWA
// ==========================================

const CACHE_NAME = "ruleta-pwa-v3";

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
// INSTALAR SERVICE WORKER
// ==========================================

self.addEventListener("install", (event) => {

    console.log(
        "Service Worker instalando..."
    );

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                console.log(
                    "Guardando archivos en caché..."
                );

                return cache.addAll(ARCHIVOS);

            })
            .then(() => {

                console.log(
                    "Nueva versión de la PWA preparada."
                );

                // Activa inmediatamente la nueva versión
                return self.skipWaiting();

            })

    );

});


// ==========================================
// ACTIVAR NUEVA VERSIÓN
// ==========================================

self.addEventListener("activate", (event) => {

    console.log(
        "Service Worker activado."
    );

    event.waitUntil(

        caches.keys()
            .then((nombresCache) => {

                return Promise.all(

                    nombresCache
                        .filter((nombreCache) => {

                            return (
                                nombreCache !== CACHE_NAME
                            );

                        })
                        .map((nombreCache) => {

                            console.log(
                                "Eliminando caché antigua:",
                                nombreCache
                            );

                            return caches.delete(
                                nombreCache
                            );

                        })

                );

            })
            .then(() => {

                // Hace que las páginas abiertas
                // usen inmediatamente el nuevo SW
                return self.clients.claim();

            })

    );

});


// ==========================================
// INTERCEPTAR PETICIONES
// ==========================================

self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
            .then((respuestaCache) => {

                if (respuestaCache) {

                    return respuestaCache;

                }

                return fetch(event.request);

            })

    );

});
