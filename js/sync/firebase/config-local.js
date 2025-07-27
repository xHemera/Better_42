const firebaseConfig = {
  apiKey: "AIzaSyD-LH1qQ38ddMh8ouKgpZVHk2AAZQFTemg",
  authDomain: "better-42-a4d07.firebaseapp.com",
  projectId: "better-42-a4d07",
  storageBucket: "better-42-a4d07.firebasestorage.app",
  messagingSenderId: "391312008928",
  appId: "1:391312008928:web:15eaf5b2fa14779f9b5285"
};

const initFirebase = async () => {
  try {
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();
    
    await auth.signInAnonymously();
    window.firebaseApp = app;
    window.firebaseDB = db;
    window.firebaseAuth = auth;
    window.firebaseReady = true;
    document.dispatchEvent(new CustomEvent('firebaseReady'));
    
  } catch (error) {
    window.firebaseReady = false;
  }
};

setTimeout(initFirebase, 100);