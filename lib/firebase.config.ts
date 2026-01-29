import { initializeApp, getApps } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported as isMessagingSupported,
} from "firebase/messaging";
import type { Analytics } from "firebase/analytics";
import type { Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBh22tBvb-quvKHMc2lqD7x7cH4a-9Tt78",
  authDomain: "skill-barter-70f37.firebaseapp.com",
  projectId: "skill-barter-70f37",
  storageBucket: "skill-barter-70f37.firebasestorage.app",
  messagingSenderId: "282472185862",
  appId: "1:282472185862:web:9e8d5e1032b0ed2b79c387",
  measurementId: "G-QZ7V161PH5",
};

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics and Messaging are browser-only
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

// Initialize browser-only services
export const initializeFirebaseServices = async () => {
  if (typeof window !== "undefined") {
    // Initialize Analytics
    const analyticsSupported = await isAnalyticsSupported();
    if (analyticsSupported && !analytics) {
      analytics = getAnalytics(app);
    }

    // Initialize Messaging
    const messagingSupported = await isMessagingSupported();
    if (messagingSupported && !messaging) {
      messaging = getMessaging(app);
    }
  }

  return { analytics, messaging };
};

// Get the messaging instance (browser-only)
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;

  const supported = await isMessagingSupported();
  if (!supported) return null;

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return messaging;
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    if (typeof window === "undefined") return null;

    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Get messaging instance
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      console.log("Firebase Messaging is not supported");
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      localStorage.setItem("fcmToken", token);
      return token;
    }

    console.log("No registration token available");
    return null;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: unknown) => void) => {
  if (typeof window === "undefined" || !messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
};

export { app, analytics, messaging };
