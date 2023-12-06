import React , {useContext} from 'react';
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min';
import AuthContext from '../contexts/AuthContext';


const PrivateRoute = ({ path, component }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? (
      <Route path={path} component={component} />
    ) : (
      <Redirect to="/login" />
    );
  };

  export default PrivateRoute;