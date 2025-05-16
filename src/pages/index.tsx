import { Navigate } from 'react-router-dom';

export default function RootRedirect() {
  return (
    <Navigate
      to="/app"
      replace
    />
  );
}
