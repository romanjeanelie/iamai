export default function truncate(str, n = 200) {
  // var n = 200;
  return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
}
