import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBcwwB2CEBkIttJTNnKg3o37fcAaSUDhIs",
  databaseURL: "https://chatapp-adbe2-default-rtdb.firebaseio.com",
  projectId: "chatapp-adbe2",
  appId: "1:857868219512:android:14efbd685f4ab1d79d298d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.database();
export default firebase;
