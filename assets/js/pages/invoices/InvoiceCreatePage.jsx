import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Field from "../../components/Field";
import Select from "../../components/Select";
import customersAPI from "../../services/customersAPI";
import axios from "axios";
import invoicesAPI from "../../services/invoicesAPI";

const InvoiceCreatePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
    error: "",
  });
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    error: "",
    status: "",
  });

  // Recuperation de la bonee facture quand l'id change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Recuperation des clients
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // Recuperation de la liste des clients a chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Recuperation des factures
  const fetchInvoice = async (id) => {
    try {
      const data = await invoicesAPI.find(id);
      const { amount, status, customer } = data;
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Gesion des submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
        history.replace("/invoice");
        // TODO: Flash notification success
      } else {
        await invoicesAPI.create(invoice);
        history.replace("/invoice");
        // TODO: flash succes
      }
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
        {(editing && (
          <h1 className="text-center">Modification d' une facture</h1>
        )) || <h1 className="text-center">Creer une facture</h1>}

        <Link to="/invoice" className="btn btn-secondary">
          List des Factures
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          label="Montant"
          placeholder="Montant de la facture..."
          value={invoice.amount}
          error={errors.amount}
          onChange={handleChange}
        />

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstname} {customer.lastname}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyee</option>
          <option value="PAID">Payee</option>
          <option value="CANCELLED">Annule</option>
        </Select>
        {(editing && (
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Modifier
            </button>
          </div>
        )) || (
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Creer
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default InvoiceCreatePage;
