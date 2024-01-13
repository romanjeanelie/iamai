let latitude;
let longitude;

import auth from '../app/firebaseConfig';
import User from '../app/User';
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

function toggleSignIn() {
  // if (!auth.currentUser) {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  signInWithPopup(auth, provider)
    .then(function (result) {
      if (!result) return;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
    })
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert(
          'You have already signed up with a different auth provider for that email.',
        );
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
    });
  // } else {
  //   signOut(auth);
  // }
  // signInButton.disabled = true;
}

// Listening for auth state changes.
onAuthStateChanged(auth, async function (user) {
  if (user) {
    // User is signed in.
    const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
    await loggedinuser.setuseraddress();
    console.log(user);
    // divgoogle.style.display = "none";
    redirectToHome(loggedinuser);
  }
});



async function redirectToHome(user) {
  console.log("redirect to home");
  let data = await getsessionID(user);
  window.location.href = "../index.html?lang=ad&session_id=" + data.SessionID + "&deploy_id=" + data.deploy_id;
}

const getsessionID = (user) => new Promise(function (resolve, reject) {
  // WARNING: For GET requests, body is set to null by browsers.
  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      resolve(JSON.parse(this.responseText));
    }
  });
  xhr.open("POST", "https://ai.iamplus.services/deploy_pa/getstreamname?userid=" + user.uuid + "&assistantID=pa_prompt_2023");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(user));
});


window.onload = async function () {
  let signInButton = document.getElementById('divgoogle');
  signInButton.addEventListener('click', toggleSignIn, false);
};