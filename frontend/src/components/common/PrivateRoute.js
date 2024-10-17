import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return <Component />;
};

export default PrivateRoute;
