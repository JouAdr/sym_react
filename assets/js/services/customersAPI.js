import axios from "axios";

function create(customer) {
  return axios.post(`http://localhost:8000/api/customers`, customer);
}

function find(id) {
  return axios
    .get(`http://localhost:8000/api/customers/` + id)
    .then((response) => response.data);
}

function findAll() {
  return axios
    .get(`http://localhost:8000/api/customers`)
    .then((response) => response.data["hydra:member"]);
}

function update(id, customer) {
  return axios.put(`http://localhost:8000/api/customers/` + id, customer);
}

function deleteCustomer(id) {
  return axios.delete(`http://localhost:8000/api/customers/` + id);
}

export default {
  create: create,
  update: update,
  find: find,
  findAll: findAll,
  delete: deleteCustomer,
};
