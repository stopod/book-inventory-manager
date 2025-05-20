import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  description?: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBook(data);
        setError(null);
      } catch (err) {
        setError('Failed to load book details. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      navigate('/books');
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading book details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!book) {
    return <div className="text-center py-8">Book not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/books" className="text-blue-600 hover:underline">
          &larr; Back to Books
        </Link>
        <div className="space-x-2">
          <Link
            to={`/books/${id}/edit`}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDeleteBook}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {book.imageUrl ? (
              <img
                className="h-48 w-full object-cover md:w-48"
                src={book.imageUrl}
                alt={book.title}
              />
            ) : (
              <div className="h-48 w-full md:w-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-gray-600 mb-4">by {book.author}</p>
              </div>
              <div>
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                  book.quantity > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500">ISBN</h2>
                <p>{book.isbn}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500">Quantity</h2>
                <p>{book.quantity}</p>
              </div>
              {book.publisher && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Publisher</h2>
                  <p>{book.publisher}</p>
                </div>
              )}
              {book.publishYear && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Publish Year</h2>
                  <p>{book.publishYear}</p>
                </div>
              )}
              {book.category && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Category</h2>
                  <p>{book.category}</p>
                </div>
              )}
              {book.price && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Price</h2>
                  <p>${book.price.toFixed(2)}</p>
                </div>
              )}
            </div>

            {book.description && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-2">Description</h2>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}

            <div className="border-t pt-4 text-sm text-gray-500">
              <p>Created: {new Date(book.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(book.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
