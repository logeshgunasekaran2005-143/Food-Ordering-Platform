import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        🍔 Food Hub 
      </Link>
      <div className="collapse navbar-collapse">
      <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/menu">
              Menu
            </Link>
          </li>
          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  My Orders
                </Link>
              </li>
            </>
          )}
          {user?.role === 'admin' && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item d-flex align-items-center text-light me-3">
                Hi, {user.name}
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
