import  { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import type { PrivateRouteProps } from '../types';

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;