/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
export async function callMsGraph(accessToken, endPoint) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(endPoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getFileFromMsGraph(accessToken, endPoint) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(endPoint, options)
    .then((response) => response)
    .catch((error) => console.log(error));
}
