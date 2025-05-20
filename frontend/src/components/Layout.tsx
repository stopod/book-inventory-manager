import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Book Inventory Manager
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/books" className="hover:text-gray-300">
                      Books
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-4">{user?.name || user?.email}</span>
                    <button
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-gray-300">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-gray-300">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Book Inventory Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
