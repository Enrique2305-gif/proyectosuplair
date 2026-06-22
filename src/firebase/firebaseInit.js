import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD46ct3rYTaeaG8y13_8faVo7zMOHgp0qo",
  authDomain: "contabillyapp.firebaseapp.com",
  projectId: "contabillyapp",
  storageBucket: "contabillyapp.appspot.com",
  messagingSenderId: "690734377975",
  appId: "1:690734377975:web:0e0d76de67a714c0f81cf2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
//const messaging = firebase.messaging();
const messaging = null;
const vapidKey = 'BHc-8Tl9ikKidFtKVlOY6Np92Yhywg_oL9JcdpHlthGPLwvimNapOPENTs-P3tG19imDc4yy3EeX0aFstxlnMrE';

export const getTokenUser = async(setTokenFound) => {
  let currentToken = '';
  try {
    currentToken = await messaging.getToken({vapidKey: vapidKey});
    if(currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  }
  catch(error){
    console.log('An error occurred while retrieving token. ', error);
  }
  return currentToken;
}

export const onMessageListener = () => {
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    })
  })
}

// getToken(messaging, { vapidKey: vapidKey })
// .then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

// messaging.onMessage((payload) => {
//   //Show UI to the user
//   console.log("on Message: ", payload)
// })