let latitude;
let longitude;

import { app, auth } from './firebaseConfig';
import User from './User';
import { getUser, getsessionID, saveUserDataFireDB, getUserDataFireDB } from './User';
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

var signInButton, animation;
const divintrotext = document.getElementById("divintrotext");
const divintrologo = document.getElementById("divintrologo");

const divlogin = document.getElementById("divlogin");
const divinfotext = document.getElementById("divinfotext");

const divwaitlist = document.getElementById("divwaitlist");
const divlottieanimation = document.getElementById("divlottieanimation");



function toggleSignIn() {
  signInButton.style.display = "none";
  divlottieanimation.style.display = "block";
  animation.play();
  // if (!auth.currentUser) {
  const provider = new GoogleAuthProvider();
  // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  provider.addScope('profile');
  provider.addScope('email');
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
        signInButton.style.display = "block";
        divlottieanimation.style.display = "none";
        animation.stop();
        // divlogin.style.display = "flex";
        // console.error(error);
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
    console.log("user", user)
    // User is signed in.
    const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
    // var userstatus = await getUserDataFireDB(user);
    // if (userstatus) {
    //   if (userstatus.status == "active") {
    //     await loggedinuser.setuseraddress();
        redirectToHome(loggedinuser);
      // } else {
      //   divwaitlist.style.display = "flex";
    //   }
    // } else {
    //   await saveUserDataFireDB(user);
    //   divwaitlist.style.display = "flex";
    // }
  }else{
    divwaitlist.style.display = "none";
    divlogin.style.display = "none";
    // animateString("hello, I am", divintrotext, "", function () {
      divintrotext.style.display = "none";
      // animateString("Asterizk ", divintrologo, "../images/asterizk.svg", function () {
        divintrologo.style.display = "none";
        divlogin.style.display = "flex";
        const texts = ["Find a flight to Bali", "Get a taxi to office", "Book a Hotel", "Tell me joke", "What are the movies playing"];
        startAnimations(texts, divinfotext);
      // });
    // });
  }
});

async function redirectToHome(user) {
  console.log("redirect to home");
  let data = await getsessionID(user);
  window.location.href = "./main.html?lang=ad&session_id=" + data.SessionID + "&deploy_id=" + data.deploy_id;
}

window.onload = async function () {
  // const loggedinuser = await getUser();
  signInButton = document.getElementById('divgoogle');
  // if (loggedinuser) { redirectToHome(loggedinuser) } else {
  signInButton.addEventListener('click', toggleSignIn, false);
  // }
  divlottieanimation.style.display = "none";
  animation = lottie.loadAnimation({
    container: divlottieanimation,
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: '../animations/asterisk_loading.json' // Replace with the actual path to your Lottie JSON file
  });
};

function startAnimations(textArray, element) {
  let index = 0;

  function next() {
    if (index < textArray.length) {
      animateString(textArray[index++], element, "", next, 50, 1, 1600);
    } else {
      index = 0
      animateString(textArray[index++], element, "", next, 50, 1, 1600);
    }
  }

  next();
}

function animateString(str, element, imgSrc = "", callback, delay = 150, deletedelay = 50, fulltextdelay = 1000) {
  if (!element) return; // Element not found

  let i = 0;
  let isAdding = true;

  function createImageElement() {
    const img = document.createElement('img');
    img.src = imgSrc;
    return img;
  }

  function updateText() {
    if (isAdding) {
      element.textContent += str[i++];
      if (i === str.length) {
        isAdding = false;
        if (imgSrc && imgSrc.length > 0) {
          setTimeout(delay);
          const img = createImageElement();
          img.alt = str[i];
          element.appendChild(img);
        }
        // else {
        setTimeout(updateText, fulltextdelay); 
        // }
      } else {
        setTimeout(updateText, delay);
      }
    } else {
      element.textContent = element.textContent.slice(0, -1);
      if (element.textContent.length > 0) {
        setTimeout(updateText, deletedelay);
      } else if (callback) {
        callback();
      }
    }
  }
  updateText();
}