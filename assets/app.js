import React, { useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./js/components/Navbar";
import {
  HashRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import "./styles/app.css";
import HomePage from "./js/pages/HomePage";
import CustomerPage from "./js/pages/customers/CustomerPage";
import InvoicesPage from "./js/pages/invoices/InvoicesPage";
import UserPages from "./js/pages/users/UserPages";
import LoginPage from "./js/pages/auths/LoginPage";
import RegisterPage from "./js/pages/auths/RegisterPage";
import authAPI from "./js/services/authAPI";
import AuthContext from "./js/contexts/AuthContext";
import CustomerCreatePage from "./js/pages/customers/CustomerCreatePage";
import InvoiceCreatePage from "./js/pages/invoices/InvoiceCreatePage";
import PrivateRoute from "./js/components/PrivateRoute";

authAPI.setup();

const App = () => {
  const NavWithRouter = withRouter(Navbar);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated
  );

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <Router>
        <NavWithRouter />
        <div className="container pt-3">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/user" component={UserPages} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/customer/:id" component={CustomerCreatePage} />
            <PrivateRoute path="/customer" component={CustomerPage} />
            <PrivateRoute path="/invoice/:id" component={InvoiceCreatePage} />
            <PrivateRoute path="/invoice" component={InvoicesPage} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

const domNode = document.getElementById("app");
const root = createRoot(domNode);
root.render(
<StrictMode>
  <App />
</StrictMode>
);
