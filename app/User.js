import { onAuthStateChanged } from 'firebase/auth';
import auth from '../app/firebaseConfig';

class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
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
  getCurrentUser(auth).then(user => {
    if (user) {
      // User is signed in
      const loggedinuser = new User(user.uid, user.displayName, user.photoURL, user.email);
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

export { getUser, redirectToLogin };
