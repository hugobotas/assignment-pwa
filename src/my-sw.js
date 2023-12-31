import { precacheAndRoute } from 'workbox-precaching'
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {
    pageCache,
    imageCache,
    staticResourceCache
} from 'workbox-recipes';

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-json') {
        event.waitUntil(fetchAndCacheWeather());
    }
});

precacheAndRoute(self.__WB_MANIFEST)
cacheJson();
pageCache();
staticResourceCache();
imageCache();

function cacheJson() {
    const cacheName = 'json';
    const matchCallback = ({request}) => request.url.match(/api.ipma.pt\/.*json$/)
    const networkTimeoutSeconds = 3;

    registerRoute(
        matchCallback,
        new NetworkFirst({
            networkTimeoutSeconds,
            cacheName,
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );
}

const getFormattedTime = (date) => {
    const formatTwoDigits = (number) => `0${number}`.slice(-2);
    const hours = formatTwoDigits(date.getHours());
    const minutes = formatTwoDigits(date.getMinutes());
    const seconds = formatTwoDigits(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
};
const getResponseWithFormattedTime = async (response) => {
    const responseBody = await response.json();
    return new Response(JSON.stringify({
        ...responseBody,
        formattedTime: getFormattedTime(new Date()),
    }));
};
const fetchAndCacheWeather = async () => {
    const url = `https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json`;
    const response = await fetch(url);
    const responseWithTime = await getResponseWithFormattedTime(response);

    const cache = await caches.open('json');
    await cache.put(url, responseWithTime);
};
