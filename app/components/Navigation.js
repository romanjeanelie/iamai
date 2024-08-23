export default class Navigation {
  constructor({ user }) {
    this.user = user;

    this.headerNav = document.querySelector(".header-nav");
    this.userPicture = this.headerNav.querySelector(".user-logo img");
    console.log(this.userPicture);

    this.addListeners();
    this.setUserImage();
  }

  setUserImage() {
    if (!this.user.picture) return;
    this.userPicture.src = this.user.picture;
  }

  addListeners() {}
}
