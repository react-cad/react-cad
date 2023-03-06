/*! based on coi-serviceworker v0.1.6 - Guido Zuidhof, licensed under MIT */
/// <reference lib="webworker" />

if (typeof window === "undefined") {
  const sw = (self as unknown) as ServiceWorkerGlobalScope & typeof globalThis;

  sw.addEventListener("install", () => sw.skipWaiting());
  sw.addEventListener("activate", (event) =>
    event.waitUntil(sw.clients.claim())
  );

  sw.addEventListener("message", (ev) => {
    if (ev.data && ev.data.type === "deregister") {
      sw.registration
        .unregister()
        .then(() => {
          return sw.clients.matchAll();
        })
        .then((clients: WindowClient[]) => {
          clients.forEach((client) => client.navigate(client.url));
        });
    }
  });

  sw.addEventListener("fetch", function (event) {
    if (
      event.request.cache === "only-if-cached" &&
      event.request.mode !== "same-origin"
    ) {
      return;
    }

    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.status === 0) {
          return response;
        }

        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        newHeaders.set("X-Frame-Options", "DENY");
        newHeaders.set("X-Content-Type-Options", "nosniff");
        newHeaders.set("Referrer-Policy", "same-origin");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      })
    );
  });
} else {
  (() => {
    // You can customize the behavior of this script through a global `coi` variable.
    const coi = {
      shouldRegister: () => true,
      shouldDeregister: () => false,
      doReload: () => window.location.reload(),
      quiet: false,
    };

    const n = navigator;
    if (
      coi.shouldDeregister() &&
      n.serviceWorker &&
      n.serviceWorker.controller
    ) {
      n.serviceWorker.controller.postMessage({ type: "deregister" });
    }

    // If we're already coi: do nothing. Perhaps it's due to this script doing its job, or COOP/COEP are
    // already set from the origin server. Also if the browser has no notion of crossOriginIsolated, just give up here.
    if (window.crossOriginIsolated !== false || !coi.shouldRegister()) return;

    if (!window.isSecureContext) {
      !coi.quiet &&
        console.log(
          "COOP/COEP Service Worker not registered, a secure context is required."
        );
      return;
    }

    // In some environments (e.g. Chrome incognito mode) this won't be available
    if (n.serviceWorker) {
      n.serviceWorker
        .register((window.document.currentScript as HTMLScriptElement).src)
        .then(
          (registration) => {
            console.log(
              "COOP/COEP Service Worker registered",
              registration.scope
            );

            registration.addEventListener("updatefound", () => {
              !coi.quiet &&
                console.log(
                  "Reloading page to make use of updated COOP/COEP Service Worker."
                );
              coi.doReload();
            });

            // If the registration is active, but it's not controlling the page
            if (registration.active && !n.serviceWorker.controller) {
              !coi.quiet &&
                console.log(
                  "Reloading page to make use of COOP/COEP Service Worker."
                );
              coi.doReload();
            }
          },
          (err) => {
            !coi.quiet &&
              console.error(
                "COOP/COEP Service Worker failed to register:",
                err
              );
          }
        );
    }
  })();
}
