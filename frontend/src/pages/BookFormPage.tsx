import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  publisher: z.string().optional(),
  publishYear: z.string().transform((val) => (val ? parseInt(val, 10) : undefined)).optional(),
  description: z.string().optional(),
  quantity: z.string().refine(val => parseInt(val, 10) >= 1, 'Quantity must be at least 1').transform((val) => parseInt(val, 10)),
  price: z.string().transform((val) => (val ? parseFloat(val) : undefined)).optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
});

type BookFormData = z.input<typeof bookSchema>;
type BookData = z.output<typeof bookSchema>;

const BookFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishYear: '',
      description: '',
      quantity: '0',
      price: '',
      imageUrl: '',
      category: '',
    },
  });

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          setIsLoading(true);
          const token = localStorage.getItem('accessToken');
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Transform data to match form field types
          reset({
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            publisher: data.publisher || '',
            publishYear: data.publishYear ? data.publishYear.toString() : '',
            description: data.description || '',
            quantity: data.quantity.toString(),
            price: data.price ? data.price.toString() : '',
            imageUrl: data.imageUrl || '',
            category: data.category || '',
          });
          
          setError(null);
        } catch (err) {
          setError('Failed to load book details. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBook();
  }, [id, reset]);

  const onSubmit = async (formData: BookFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // すべての値を文字列として送信するシンプルオブジェクトを作成
      const rawData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        publisher: formData.publisher || '',
        publishYear: formData.publishYear || '',
        description: formData.description || '',
        quantity: formData.quantity,  // 文字列型として送信
        price: formData.price || '',
        imageUrl: formData.imageUrl || '',
        category: formData.category || ''
      };
      
      console.log('Sending data to API:', rawData);
      
      // APIリクエストの直接実行
      if (isEditMode && id) {
        await axios.post(
          `/api/books/${id}`,
          rawData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
      } else {
        await axios.post(
          `/api/books`,
          rawData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
      }
      
      navigate('/books');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to save book. Please check your input and try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return <div className="text-center py-8">Loading book details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/books" className="text-blue-600 hover:underline">
          &larr; Back to Books
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Book' : 'Add New Book'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="author" className="block mb-1 font-medium">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              {...register('author')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="isbn" className="block mb-1 font-medium">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="isbn"
              {...register('isbn')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              disabled={isEditMode} // Can't change ISBN in edit mode
            />
            {errors.isbn && (
              <p className="text-red-500 text-sm mt-1">{errors.isbn.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="publisher" className="block mb-1 font-medium">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              {...register('publisher')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.publisher && (
              <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="publishYear" className="block mb-1 font-medium">
              Publish Year
            </label>
            <input
              type="number"
              id="publishYear"
              {...register('publishYear')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.publishYear && (
              <p className="text-red-500 text-sm mt-1">{errors.publishYear.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block mb-1 font-medium">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              min="0"
              {...register('quantity')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block mb-1 font-medium">
              Price
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register('price')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 font-medium">
              Category
            </label>
            <input
              type="text"
              id="category"
              {...register('category')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="imageUrl" className="block mb-1 font-medium">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              {...register('imageUrl')}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            to="/books"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-70"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookFormPage;
