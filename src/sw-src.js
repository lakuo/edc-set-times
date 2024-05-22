// This is a basic service worker that uses Workbox to handle precaching of assets.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
    console.log(`Workbox is loaded`);

    // Precaching the files Workbox will handle caching and updating the assets based on the manifest.
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
    console.log(`Workbox didn't load`);
}