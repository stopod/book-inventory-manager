import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-8">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
