let latitude;
let longitude;

import auth from '../app/firebaseConfig';
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

class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
    this.timezone = getUserTimezone();
    this.area_name = "";
    this.country_name = "";
    this.pincode = "";
    this.iso_2d_country_code = "";
    this.administrative_area_level_1 = "";
    this.administrative_area_level_2 = "";
  }
  async setuseraddress() {
    let address = await getaddressdetails()
    this.area_name = address.area_name;
    this.country_name = address.country_name;
    this.pincode = address.pincode;
    this.iso_2d_country_code = address.iso_2d_country_code;
    this.administrative_area_level_1 = address.administrative_area_level_1;
    this.administrative_area_level_2 = address.administrative_area_level_2;
  }
}

async function redirectToHome(user) {
  console.log("redirect to home");
  let data = await getsessionID(user);
  window.location.href = "../index.html?lang=ad&session_id=" + data.SessionID + "&deploy_id=" + data.deploy_id;
}

// window.handleCredentialResponse = async (response) => {
//   console.log(response);
//   const responsePayload = decodeJwtResponse(response.credential);
//   console.log(responsePayload);
//   const user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
//   await user.setuseraddress();
//   console.log(user);
//   divgoogle.style.display = "none";
//   localStorage.setItem("googleToken", response.credential);
//   redirectToHome(user);

// };




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

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getaddressdetails() {
  return new Promise(async (resolve, reject) => {
    let location = await getUserLocation();
    location = JSON.parse(location);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        resolve(JSON.parse(this.responseText))
      }
    });
    let url = "https://ai.iamplus.services/location/getaddress?latitude=" + location.lat + "&longitude=" + location.long;
    console.log("URL:" + url)
    xhr.open("GET", url);
    xhr.send();
  });
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      resolve(getipadress());
      // reject(new Error("Geolocation is not supported by your browser"));
    } else {
      // navigator.geolocation.getCurrentPosition(success, getipadress);
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("got geo location");
        resolve(JSON.stringify({ "lat": pos.coords.latitude, "long": pos.coords.longitude }))
      },
        (error) => {
          console.log("Geolocation permission denied");
          resolve(getipadress());
        });
    }
  });
}

const getipadress = () => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.ipdata.co/?api-key=edadfa1ba2f38b1066342735ae303338478afada8e5eeb770929fafd');
    request.setRequestHeader('Accept', 'application/json');
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var data = JSON.parse(this.responseText)
        console.log(`ip lat: ${data.latitude} long: ${data.longitude}`);
        resolve(JSON.stringify({ "lat": data.latitude, "long": data.longitude }))
      }
    };
    request.send();
  });
}
window.onload = async function () {
  let signInButton = document.getElementById('divgoogle');
  signInButton.addEventListener('click', toggleSignIn, false);
};

export { auth }