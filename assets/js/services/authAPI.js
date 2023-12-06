import axios from "axios";
import { jwtDecode } from "jwt-decode";

function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

function logout() {
  // On efface le token dans le localtstorge
  window.localStorage.removeItem("authToken");
  // On previent axios d'effacer le header authorization
  delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // On stocke le token dans le localtstorge
      window.localStorage.setItem("authToken", token);
      // On previent axios qu'on a un header par defaut sur tout nos futures requettes
      setAxiosToken(token);
    });
}

export default {
  isAuthenticated,
  authenticate,
  logout,
  setup,
};
