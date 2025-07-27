
setTimeout(() => {
  
  if (typeof firebase !== 'undefined') {
    
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyD-LH1qQ38ddMh8ouKgpZVHk2AAZQFTemg",
        authDomain: "better-42-a4d07.firebaseapp.com",
        projectId: "better-42-a4d07",
        storageBucket: "better-42-a4d07.firebasestorage.app",
        messagingSenderId: "391312008928",
        appId: "1:391312008928:web:15eaf5b2fa14779f9b5285"
      };
      
      const app = firebase.initializeApp(firebaseConfig);
      
      const db = firebase.firestore();
      
      window.testFirebaseWorking = true;
      
    } catch (error) {
    }
    
  } else {
  }
}, 500);

window.testFirebase = function() {
  return typeof firebase;
};