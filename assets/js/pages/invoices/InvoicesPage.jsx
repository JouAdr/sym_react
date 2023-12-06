import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Pagination from "../../components/Pagination";
import InvoicesAPI from "../../services/invoicesAPI";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCELLED: "warning",
};

const STATUS_LABELS = {
  PAID: "Paye",
  SENT: "Envoye",
  CANCELLED: "Annule",
};

const InvoicesPage = ({}) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const data = await axios
        .get(`http://localhost:8000/api/invoices`)
        .then((response) => response.data["hydra:member"]);
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Delete Invoices
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
    }
  };

  // Permet de rechercher dans le tableau
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Gestion du chngement de la page
  const handlePageChange = (page) => setCurrentPage(page);

  // Pagination
  const paginatedInvoices = Pagination.getData(
    invoices,
    currentPage,
    itemsPerPage
  );

  // Format date
  const formatDatte = (str) => moment(str).format("DD/MM/YY");

  return (
    <>
      <div className=" mb-3 d-flex justify-content-between align-items-center">
        <h1 className="text-center">List des factures</h1>
        <Link to="/invoice/new" className="btn btn-secondary">
          Creer une facture
        </Link>
      </div>
      <div className="form-group ">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>Id.</th>
            <th className="text-center">Client</th>
            <th className="text-center">Status</th>
            <th className="text-center">Date</th>
            <th className="text-center">Montant</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td> {invoice.id} </td>
              <td className="text-center">
                <a href="#">
                  {invoice.customer.firstname} {invoice.customer.lastname}
                </a>
              </td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center"> {formatDatte(invoice.sentAt)} </td>
              <td className="text-center"> {invoice.amount} $</td>
              <td className="text-center">
                <Link
                  to={`/invoice/${invoice.id}`}
                  className="btn btn-sm btn-success mr-sm-2"
                >
                  Editer
                </Link>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                  data-bs-theme="light"
                >
                  Suprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default InvoicesPage;
