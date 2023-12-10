let latitude;
let longitude;

export function isUser() {
  return localStorage.getItem("googleToken");
}

window.onload = async function () {
  if (isUser()) {
    const responsePayload = decodeJwtResponse(isUser());
    console.log(responsePayload);

    const user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
    await user.setuseraddress();
    console.log(user);
    divgoogle.style.display = "none";
    redirectToHome(user);


  } else {
    console.log("no logged in");
    // divgoogle.style.display = "block";
  }
};

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

window.handleCredentialResponse = async (response) => {
  console.log(response);
  const responsePayload = decodeJwtResponse(response.credential);
  console.log(responsePayload);
  const user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
  await user.setuseraddress();
  console.log(user);
  divgoogle.style.display = "none";
  localStorage.setItem("googleToken", response.credential);
  redirectToHome(user);

};

// Sign out the user
function signout() {
  google.accounts.id.disableAutoSelect();
  divgoogle.style.display = "flex";
}

function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
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
        latitude = data.latitude;
        longitude = data.longitude;
        resolve(JSON.stringify({ "lat": data.latitude, "long": data.longitude }))
      }
    };
    request.send();
  });
}