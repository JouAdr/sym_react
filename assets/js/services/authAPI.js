import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * Position le token sur axios
 * @param {string} token 
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place du chargement de l'appliication
 */
function setup() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentfie ou pas
 * @returns boolean
 */

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

/**
 * Deconnexion
 */
function logout() {
  // On efface le token dans le localtstorge
  window.localStorage.removeItem("authToken");
  // On previent axios d'effacer le header authorization
  delete axios.defaults.headers["Authorization"];
}


/**
 * Requete HTTP d'authentification et stockage du token dans localstorage et axios
 * @param {object} credentials 
 */
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
