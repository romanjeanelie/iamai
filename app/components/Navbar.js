export default class Navbar {
  constructor({ user }) {
    this.user = user;

    this.headerNav = document.querySelector(".header-nav");
    console.log(this.headerNav);
    this.userPicture = this.headerNav.querySelector(".user-logo img");
    console.log(this.userPicture);

    this.addListeners();
    this.setUserImage();
  }

  setUserImage() {
    this.userPicture.src = this.user.picture;
  }

  addListeners() {}
}
