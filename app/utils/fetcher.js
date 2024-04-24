export default async function fetcher({ url, params, idToken, method = "GET" }) {
  try {
    let options = {
      method,
      headers: {},
    };

    if(idToken)
      options.headers["GOOGLE_IDTOKEN"] = idToken;

    if (method === "POST") {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(params);
    } else {
      const queryParams = new URLSearchParams(params);
      url = `${url}?${queryParams}`;
    }
    
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error };
  }
}
