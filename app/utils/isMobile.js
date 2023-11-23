import { tablet } from "../../scss/variables/_breakpoints.module.scss";

export default function isMobile() {
  return window.innerWidth <= parseInt(tablet);
}
