import axios from "axios";

function find(id) {
  return axios
    .get(`http://localhost:8000/api/invoices/` + id)
    .then((response) => response.data);
}

function findAll() {
  return axios
    .get("http://localhost:8000/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

function create(invoice) {
  return axios.post("http://localhost:8000/api/invoices", {
    ...invoice,
    customer: "api/customers/" + invoice.customer,
  });
}

function update(id, invoice) {
  return axios.put("http://localhost:8000/api/invoices/" + id, {
    ...invoice,
    customer: "api/customers/" + invoice.customer,
  });
}

function deleteInvoice(id) {
  return axios.delete(`http://localhost:8000/api/invoices/` + id);
}

export default {
  create,
  find,
  findAll,
  update,
  delete: deleteInvoice,
};
