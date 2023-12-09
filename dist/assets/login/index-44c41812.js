function isUser() {
  return localStorage.getItem("googleToken");
}
window.onload = async function() {
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
    let address = await getuserAddress();
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
  await getsessionID(user);
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
function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window.atob(base64).split("").map(function(c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("")
  );
  return JSON.parse(jsonPayload);
}
const getsessionID = (user) => new Promise(function(resolve, reject) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function() {
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
async function getuserAddress() {
  return new Promise(async (resolve, reject) => {
    let location;
    try {
      location = await getUserLocation();
      location = await JSON.parse(success(location));
    } catch (execption) {
      location = await error();
    }
    location = JSON.parse(location);
    console.log(location);
    console.log(location.lat);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      }
    });
    xhr.open("GET", "https://ai.iamplus.services/location/getaddress?latitude=" + location.lat + "&longitude=" + location.long);
    xhr.send();
  });
}
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}
const success = (position) => {
  return new Promise((resolve, reject) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    position.coords.altitude;
    position.coords.accuracy;
    resolve(JSON.stringify({ "lat": latitude, "long": longitude }));
  });
};
const error = () => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.ipdata.co/?api-key=edadfa1ba2f38b1066342735ae303338478afada8e5eeb770929fafd");
    request.setRequestHeader("Accept", "application/json");
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        var data = JSON.parse(this.responseText);
        resolve(JSON.stringify({ "lat": data.latitude, "long": data.longitude }));
      }
    };
    request.send();
  });
};
export {
  isUser
};
