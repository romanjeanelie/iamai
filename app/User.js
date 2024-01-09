class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
  }
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

function getUser() {
  if (localStorage.getItem("googleToken")) {
    const responsePayload = decodeJwtResponse(localStorage.getItem("googleToken"));
    return new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
  } else {
    return null;
  }
}

function redirectToLogin() {
  console.log("notloggedin");
  window.location.href = "./login/index.html";
}

export { getUser, redirectToLogin };
