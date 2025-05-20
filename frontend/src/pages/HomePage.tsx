import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Book Inventory Manager</h1>
        <p className="text-xl text-gray-600">
          Manage your book inventory efficiently with our easy-to-use platform.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">Inventory Management</h3>
            <p className="text-gray-600">
              Keep track of all your books with detailed information including quantity, price, and more.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">Search & Filter</h3>
            <p className="text-gray-600">
              Quickly find books by title, author, ISBN, or category with our powerful search tools.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">Stock Alerts</h3>
            <p className="text-gray-600">
              Receive notifications when book quantities are low to ensure you never run out of popular titles.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        {isAuthenticated ? (
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Book Inventory
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
