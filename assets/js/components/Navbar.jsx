import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    history.push("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link className="navbar-brand" to="/">
          SymReact
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item ">
              <Link className="nav-link" to="/">
                Accueil
                <span className="sr-only">(current)</span>
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/customer">
                    Clients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoice">
                    Factures
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                    to="#"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    A propos
                  </Link>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/">
                      Profile
                    </Link>
                    <Link className="dropdown-item" to="/">
                      Parametre
                    </Link>
                    <Link className="dropdown-item" to="/">
                      Autre
                    </Link>
                  </div>
                </li>
              </>
            )}
          </ul>
          <form className="form-inline my-2 my-lg-0">
            {(!isAuthenticated && (
              <>
                <Link
                  className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-sm-2"
                  type="button"
                  to="/register"
                >
                  Inscription
                </Link>
                <Link
                  className="btn btn-sm btn-outline-info my-2 my-sm-0 mr-sm-2"
                  type="button"
                  to="/login"
                >
                  Connexion
                </Link>
              </>
            )) || (
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger"
                type="button"
              >
                Deconnexion
              </button>
            )}
          </form>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
