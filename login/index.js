export function isUser() {
  return sessionStorage.getItem("googleToken");
}

window.onload = function () {
  if (isUser()) {
    redirectToHome();
    const responsePayload = decodeJwtResponse(isUser());
    user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
    divgoogle.style.display = "none";
  } else {
    divgoogle.style.display = "block";
  }
};

class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
  }
}

function redirectToHome() {
  window.location.href = "/app/index.html";
}

window.handleCredentialResponse = async (response) => {
  console.log(response);
  redirectToHome();
  const responsePayload = decodeJwtResponse(response.credential);
  user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
  divgoogle.style.display = "none";
  sessionStorage.setItem("googleToken", response.credential);
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
