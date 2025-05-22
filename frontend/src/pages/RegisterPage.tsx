import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  // const navigate = useNavigate(); // 未使用のためコメントアウト
  // const { register: registerUser } = useAuth(); // 未使用のためコメントアウト
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Sending request to:', '/api/auth/register');
      
      // プロキシを経由して直接相対パスでリクエストする
      const response = await axios.post(
        '/api/auth/register',
        {
          email: data.email,
          password: data.password,
          name: data.name,
        }
      );
      
      // 登録成功
      console.log('Registration successful:', response.data);
      
      // トークンを保存
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // 認証状態を更新するためにreloadする
      window.location.href = '/books';
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request error - no response received:', err.request);
      } else {
        console.error('Error details:', err.message);
      }
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-70"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
