import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKCBrlDQkunVquoNdw94fgY6ePIAzMps8",
  authDomain: "vue-chatapp-spaceapps-2020.firebaseapp.com",
  databaseURL: "https://vue-chatapp-spaceapps-2020.firebaseio.com",
  projectId: "vue-chatapp-spaceapps-2020",
  storageBucket: "vue-chatapp-spaceapps-2020.appspot.com",
  messagingSenderId: "913384558228",
  appId: "1:913384558228:web:f51e4ba989cd703c902e81"
};

var fire = firebase.initializeApp(firebaseConfig);
export default fire;