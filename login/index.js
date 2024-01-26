let latitude;
let longitude;

import { app, auth } from '../app/firebaseConfig';
import User from '../app/User';
import { getUser, getsessionID, saveUserDataFireDB, getUserDataFireDB } from '../app/User';
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

var signInButton;
const ptext = document.getElementById("ptext");

function toggleSignIn() {
  signInButton.style.display = "none";
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
    console.log("user",user)
    // User is signed in.
    const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
    // var userstatus = await getUserDataFireDB(user);
    // if (userstatus) {
      // if (userstatus.status == "active") {
        await loggedinuser.setuseraddress();
        redirectToHome(loggedinuser);
      // }else{
        // ptext.innerText = "You are part of the waitlist, we will inform you once you account has been approved and activated."
    //   }
    // } else {
    //   await saveUserDataFireDB(user);
    //   ptext.innerText = "Thanks for joining the waitlist"
    // }
  }
});

async function redirectToHome(user) {
  console.log("redirect to home");
  let data = await getsessionID(user);
  window.location.href = "../index.html?lang=ad&session_id=" + data.SessionID + "&deploy_id=" + data.deploy_id;
}

window.onload = async function () {
  // const loggedinuser = await getUser();
  signInButton = document.getElementById('divgoogle');
  // if (loggedinuser) { redirectToHome(loggedinuser) } else {
    signInButton.style.display = "block";
    signInButton.addEventListener('click', toggleSignIn, false);
  // }
};