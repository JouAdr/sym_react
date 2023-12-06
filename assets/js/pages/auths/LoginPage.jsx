import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthAPI from "../../services/authAPI";
import AuthContext from "../../contexts/AuthContext";
import Field from "../../components/Field";

const LoginPage = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion des submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customer");
    } catch (error) {
      setError("Les informations ne correspondent pas");
    }
  };

  return (
    <>
      {!isAuthenticated && (
        <div className="row">
          <div className="col-lg-6 ">
            <div>
              <h1>Page de connexion</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <Field
                label="Adresse mail"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Adresse mail"
                error={error}
                type="text"
              />
              <Field
                label="Mot de passe"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="mot de passe"
                error={error}
                type="password"
              />
              <div className="form-group">
                <button type="submit" className="btn btn-success mr-sm-2">
                  Se connecter
                </button>
                <Link to="/register"> S'inscrire </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
