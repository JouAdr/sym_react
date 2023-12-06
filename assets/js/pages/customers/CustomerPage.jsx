import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import CustomersAPI from "../../services/customersAPI";
import { Link } from "react-router-dom";

const CustomerPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  // Permet de recuperer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Au chrargement du composant, on cherche les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      setCustomers(originalCustomers);
    }
  };

  // Gestion du chngement de la page
  const handlePageChange = (page) => setCurrentPage(page);

  // Permet de rechercher dans le tableau
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Filter customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstname.toLowerCase().includes(search.toLowerCase()) ||
      c.lastname.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className=" mb-3 d-flex justify-content-between align-items-center">
        <h1 className="text-center">List des clients</h1>
        <Link to="/customer/new" className="btn btn-secondary">
          Creer un client
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover mt-4">
        <thead>
          <tr>
            <th className="text-center">Id.</th>
            <th className="text-center">Client</th>
            <th className="text-center">Email</th>
            <th className="text-center">Entreprise</th>
            <th className="text-center">Facture</th>
            <th className="text-center">Montant total</th>
            <th className="text-center">Actions</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td className="text-center"> {customer.id} </td>
              <td className="text-center">
                <a href="#">
                  {customer.firstname} {customer.lastname}
                </a>
              </td>
              <td className="text-center"> {customer.email} </td>
              <td className="text-center"> {customer.company} </td>
              <td className="text-center">
                <span className="badge bg-info">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center"> {customer.totalAmount} $</td>
              <td className="">
                <Link
                  to={`/customer/${customer.id}`}
                  className="btn btn-sm btn-success mr-sm-2"
                >
                  Editer
                </Link>
                <button
                  onClick={() => handleDelete(customer.id)}
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
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomerPage;
