import { useLocation, Navigate } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const RequireAuth = function ({ children }) {
  const { loggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (loggedIn === false) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
