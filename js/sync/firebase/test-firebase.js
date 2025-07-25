console.log('🔍 Test Firebase loading...');

setTimeout(() => {
  console.log('1. Firebase global:', typeof firebase);
  
  if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase est chargé !');
    console.log('2. Firebase object:', firebase);
    
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
      console.log('✅ Firebase app initialisé:', app);
      
      const db = firebase.firestore();
      console.log('✅ Firestore connecté:', db);
      
      window.testFirebaseWorking = true;
      
    } catch (error) {
      console.error('❌ Erreur init Firebase:', error);
    }
    
  } else {
    console.error('❌ Firebase pas chargé !');
  }
}, 500);

window.testFirebase = function() {
  console.log('🧪 Test function called');
  return typeof firebase;
};