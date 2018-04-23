import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyB9OIe3diVBqTmj_c-WPVQ0BdMHf3pMYNo",
    authDomain: "surf-club-la.firebaseapp.com",
    databaseURL: "https://surf-club-la.firebaseio.com",
    projectId: "surf-club-la",
    storageBucket: "surf-club-la.appspot.com",
    messagingSenderId: "731050181370"
  };
var fire = firebase.initializeApp(config);
export default fire;
