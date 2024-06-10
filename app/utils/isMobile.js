import { tablet, desktop } from "../../scss/variables/_breakpoints.module.scss";

export default function isMobile() {
  const isMobile = window.innerWidth <= parseInt(tablet);
  return isMobile;
}
