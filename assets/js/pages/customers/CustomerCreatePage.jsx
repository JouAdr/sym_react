import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../../components/Field";
import customersAPI from "../../services/customersAPI";

const CustomerCreatePage = (props) => {
  const { id = "new" } = props.match.params;
  const [editing, setEditing] = useState(false);
  const [customer, setCustomer] = useState({
    lastname: "",
    firstname: "",
    company: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    lastname: "",
    firstname: "",
    company: "",
    email: "",
  });

  const fetchCustomer = async (id) => {
    try {
      const { firstname, lastname, email, company } = await customersAPI.find(
        id
      );
      setCustomer({ firstname, lastname, company, email });
    } catch (error) {
      console.log(error.response);
      // TODO: Notification flash erreur
    }
  };

  // Chargement du customer du composant ou identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion des submit des formulaires
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await customersAPI.update(id, customer);
        props.history.replace("/customer");
        // TODO : flash notofication
      } else {
        await customersAPI.create(customer);
        // TODO : flash notofication
        props.history.replace("/customer");
      }
      setErrors("");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        // TODO : flash notofication
      }
    }
  };
  return (
    <>
      <div className=" mb-3 d-flex justify-content-between align-items-center">
        {(!editing && <h1 className="text-center"> Creer un client</h1>) || (
          <h1 className="text-center">Modification un client</h1>
        )}

        <Link to="/customer" className="btn btn-secondary">
          List des clients
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <Field
          label="Nom"
          name="lastname"
          value={customer.lastname}
          onChange={handleChange}
          placeholder="Nom..."
          type="text"
          error={errors.lastname}
        />
        <Field
          label="Prenom"
          name="firstname"
          value={customer.firstname}
          onChange={handleChange}
          placeholder="Prenom..."
          type="text"
          error={errors.firstname}
        />
        <Field
          label="Entreprise"
          name="company"
          value={customer.company}
          onChange={handleChange}
          placeholder="Entreprise..."
          type="text"
          error={errors.company}
        />
        <Field
          label="Adresse mail"
          name="email"
          value={customer.email}
          onChange={handleChange}
          placeholder="Adresse mail..."
          type="email"
          error={errors.email}
        />
        {(editing && (
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Editer client
            </button>
          </div>
        )) || (
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Creer un client
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default CustomerCreatePage;
