import { tablet } from "../../scss/variables/_breakpoints.module.scss";

export default function isMobile() {
  console.log(window.innerWidth);
  const isMobile = window.innerWidth <= parseInt(tablet);
  console.log("isMobile ", isMobile);
  return isMobile;
}
