import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../../components/Field";
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = ({ history }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [user, setUser] = useState({
    firstname: "",
    username: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion des submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users",
        user
      );
      setErrors({});
      // TODO Flash success
      toast(`Votre compte est crer avec success...`);
      history.replace("/login");
    } catch (error) {
      console.log(error.response);
      const { violations } = error.response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };
  return (
    <>
      {!isAuthenticated && (
        <div className="row">
          <div className="col-lg-6">
            <h3>Page de inscription</h3>
            <form onSubmit={handleSubmit}>
              <Field
                label="Nom"
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                placeholder="Nom..."
                error={errors.firstname}
                type="text"
              />
              <Field
                label="Prenom"
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                placeholder="Prenom..."
                error={errors.lastname}
                type="text"
              />
              <Field
                label="Surnom"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Surnom..."
                error={errors.username}
                type="text"
              />
              <Field
                label="Adresse mail"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Adresse mail..."
                error={errors.email}
                type="email"
              />
              <Field
                label="Mot de passe"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Mot de passe..."
                error={errors.password}
                type="password"
              />

              <Field
                label="Confirmer le mot de passe"
                name="passwordConfirm"
                value={user.passwordConfirm}
                onChange={handleChange}
                placeholder="Conformer le mot de passe..."
                error={errors.passwordConfirm}
                type="password"
              />
              <div className="form-group">
                <button type="submit" className="btn btn-success mr-sm-2">
                  S'inscrire
                </button>
                <Link to="/login">J'ai deja un compte</Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
