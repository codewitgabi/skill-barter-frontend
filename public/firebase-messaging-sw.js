// Firebase Messaging Service Worker
// This service worker handles background push notifications

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBh22tBvb-quvKHMc2lqD7x7cH4a-9Tt78",
  authDomain: "skill-barter-70f37.firebaseapp.com",
  projectId: "skill-barter-70f37",
  storageBucket: "skill-barter-70f37.firebasestorage.app",
  messagingSenderId: "282472185862",
  appId: "1:282472185862:web:9e8d5e1032b0ed2b79c387",
  measurementId: "G-QZ7V161PH5",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload,
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    tag: payload.data?.tag || "default",
    data: payload.data,
    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Get the URL to open from the notification data
  const urlToOpen = event.notification.data?.url || "/@me";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            if (urlToOpen) {
              client.navigate(urlToOpen);
            }
            return;
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
