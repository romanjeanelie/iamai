export default function getDomainAndFavicon(url) {
  // Ensure the URL has a protocol
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const favicon = `https://${domain}/favicon.ico`;
  return { domain, favicon };
}
