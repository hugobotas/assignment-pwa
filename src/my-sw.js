import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("api")) {
        // response to API requests, Cache Update Refresh strategy
        event.respondWith(caches.match(event.request));
        event.waitUntil(update(event.request).then(refresh));
        console.log("Botas: ", event.request.url);
    }
})
function update(request) {
    return fetch(request.url).then(
        response =>
            cache(request, response) // we can put response in cache
                .then(() => response) // resolve promise with the Response object
    );
}
function refresh(response) {
    return response
        .json() // read and parse JSON response
        .then(jsonResponse => {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    // report and send new data to client
                    client.postMessage(
                        JSON.stringify({
                            type: response.url,
                            data: jsonResponse.data
                        })
                    );
                });
            });
            return jsonResponse.data; // resolve promise with new data
        });
}

function cache(request, response) {
    if (response.type === "error" || response.type === "opaque") {
        return Promise.resolve(); // do not put in cache network errors
    }

    return caches
        .open("TESTE")
        .then(cache => cache.put(request, response.clone()));
}


