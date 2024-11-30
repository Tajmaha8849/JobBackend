export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(base64);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  const decodedToken = decodeToken(token);
  return decodedToken && decodedToken.exp * 1000 > Date.now();
};
