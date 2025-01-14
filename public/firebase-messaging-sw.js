// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDK-I2iGEABt8b80rwKmTHEAIYKKVnsS5g",
  authDomain: "imaxplatform-821dd.firebaseapp.com",
  projectId: "imaxplatform-821dd",
  storageBucket: "imaxplatform-821dd.appspot.com",
  messagingSenderId: "638668861603",
  appId: "1:638668861603:web:110bc26c28db8233388f16",
  measurementId: "G-X1H40KF4ZF",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/logo-transparent-02.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
