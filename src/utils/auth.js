export const setToken = (token) => localStorage.setItem("authToken", token);

export const getToken = () => {
  return localStorage.getItem("authToken") || null;
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

export const isLoggedIn = () => !!getToken();
