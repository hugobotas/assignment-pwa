import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)
// self.addEventListener("fetch", (event) => {
//     if (event.request.url.includes("api.ipma.pt")) {
//         // response to API requests, Cache Update Refresh strategy
//         event.respondWith(caches.match(event.request));
//         // event.waitUntil(update(event.request).then(refresh));
//          console.log("Botas: ", caches.match(event.request));
//     }
// })
// function update(request) {
//     return fetch(request.url).then(
//         response =>
//             cache(request, response) // we can put response in cache
//                 .then(() => response) // resolve promise with the Response object
//     );
// }
// function refresh(response) {
//     return response
//         .json() // read and parse JSON response
//         .then(jsonResponse => {
//             self.clients.matchAll().then(clients => {
//                 clients.forEach(client => {
//                     // report and send new data to client
//                     client.postMessage(
//                         JSON.stringify({
//                             type: response.url,
//                             data: jsonResponse.data
//                         })
//                     );
//                 });
//             });
//             return jsonResponse.data; // resolve promise with new data
//         });
// }
//
// function cache(request, response) {
//     if (response.type === "error" || response.type === "opaque") {
//         return Promise.resolve(); // do not put in cache network errors
//     }
//     var clonedResponse = response.clone();
//     return caches
//         .open("TESTE")
//         .then(cache => cache.put(request, clonedResponse));
// }
//
//
// addEventListener("fetch", function(e) {
//     e.respondWith((async function() {
//         const cachedResponse = await caches.match(e.request);
//         if (cachedResponse) {
//             return cachedResponse;
//         }
//         const networkResponse = await fetch(e.request);
//
//         const hosts = [
//             'https://www.gstatic.com',
//         ];
//
//         if (hosts.some((host) => e.request.url.startsWith(host))) {
//             // This clone() happens before `return networkResponse`
//             const clonedResponse = networkResponse.clone();
//
//             e.waitUntil((async function() {
//                 const cache = await caches.open("CACHE_NAME");
//                 // This will be called after `return networkResponse`
//                 // so make sure you already have the clone!
//                 await cache.put(e.request, clonedResponse);
//             })());
//         }
//
//         return networkResponse;
//     })());
// });