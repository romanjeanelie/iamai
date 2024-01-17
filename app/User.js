import { onAuthStateChanged } from 'firebase/auth';
import auth from '../app/firebaseConfig';

const PA_URL = import.meta.env.VITE_API_PA_URL || "https://api.iamplus.chat/deploy-pa"
const LOCATION_URL = import.meta.env.VITE_API_LOCATION_URL || "https://api.iamplus.chat/location/"
class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
    console.time("getUserTimezone");
    this.timezone = this.getUserTimezone();
    console.timeEnd("getUserTimezone");
    this.area_name = "";
    this.country_name = "";
    this.pincode = "";
    this.iso_2d_country_code = "";
    this.administrative_area_level_1 = "";
    this.administrative_area_level_2 = "";
  }
  async setuseraddress() {
    console.time("getaddressdetails");
    let address = await this.getaddressdetails()
    console.timeEnd("getaddressdetails");
    this.area_name = address.area_name;
    this.country_name = address.country_name;
    this.pincode = address.pincode;
    this.iso_2d_country_code = address.iso_2d_country_code;
    this.administrative_area_level_1 = address.administrative_area_level_1;
    this.administrative_area_level_2 = address.administrative_area_level_2;
  }

  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  getaddressdetails() {
    return new Promise(async (resolve, reject) => {
      let location = await this.getUserLocation();
      location = JSON.parse(location);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          resolve(JSON.parse(this.responseText))
        }
      });
      let url = LOCATION_URL+"getaddress?latitude=" + location.lat + "&longitude=" + location.long;
      console.log("URL:" + url)
      xhr.open("GET", url);
      xhr.send();
    });
  }
  
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        resolve(this.getipadress());
        // reject(new Error("Geolocation is not supported by your browser"));
      } else {
        // navigator.geolocation.getCurrentPosition(success, getipadress);
        navigator.geolocation.getCurrentPosition((pos) => {
          console.log("got geo location");
          resolve(JSON.stringify({ "lat": pos.coords.latitude, "long": pos.coords.longitude }))
        },
          (error) => {
            console.log("Geolocation permission denied");
            resolve(this.getipadress());
          });
      }
    });
  }
  
  getipadress = () => {
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
}

function getCurrentUser(auth) {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth,
      user => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

async function getUser() {
  return new Promise((resolve, reject) => {
  getCurrentUser(auth).then(async user => {
    if (user) {
      // User is signed in
      const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
      await loggedinuser.setuseraddress();
      console.log(" here logged in:", loggedinuser);
      resolve(loggedinuser);
    } else {
      console.log("here not logged in");
      resolve(null);
    }
  });
});
}

function redirectToLogin() {
  console.log("notloggedin");
  window.location.href = "./login/index.html";
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
  xhr.open("POST", PA_URL + "/getstreamname?userid=" + user.uuid + "&assistantID=pa_prompt_2023");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(user));
});

export default User
export { getUser, redirectToLogin, getsessionID };
