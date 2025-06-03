import { precacheAndRoute } from "workbox-precaching";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({url, request}) => url.origin === "https://story-api.dicoding.dev" && request.destination !== "image",
  new NetworkFirst({
    cacheName: "story-api-data"
  })
)

registerRoute(
  ({url, request}) => url.origin === "https://story-api.dicoding.dev" && request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "story-api-images"
  })
)

self.addEventListener("push", (event) => {
    console.log("Service Worker pushing...");

    async function notify(){
        const data = await event.data.json();
        await self.registration.showNotification(data.title, {
          body: data.options.body,
        });
    }

    event.waitUntil(notify());
    return;
});