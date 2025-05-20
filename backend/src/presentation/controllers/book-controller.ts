import { Context } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { GetAllBooksUseCase } from '../../application/usecases/book/get-all-books-usecase';
import { GetBookByIdUseCase } from '../../application/usecases/book/get-book-by-id-usecase';
import { CreateBookUseCase } from '../../application/usecases/book/create-book-usecase';
import { UpdateBookUseCase } from '../../application/usecases/book/update-book-usecase';
import { DeleteBookUseCase } from '../../application/usecases/book/delete-book-usecase';
import { PrismaBookRepository } from '../../infrastructure/repositories/prisma-book-repository';

// フロントエンドからの入力を受け入れるためのスキーマ
const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(10),
  publisher: z.string().optional(),
  publishYear: z.string().optional(), // 文字列として受け入れる
  description: z.string().optional(),
  quantity: z.string(), // 文字列として受け入れる
  price: z.string().optional(), // 文字列として受け入れる
  imageUrl: z.string().optional(),
  category: z.string().optional(),
});

export class BookController {
  private readonly bookRepository: PrismaBookRepository;
  
  constructor() {
    this.bookRepository = new PrismaBookRepository();
  }
  
  getAllBooks = async (c: Context) => {
    const getAllBooksUseCase = new GetAllBooksUseCase(this.bookRepository);
    
    try {
      const books = await getAllBooksUseCase.execute();
      return c.json(books);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          status: 500,
          message: 'Internal Server Error',
        },
        500
      );
    }
  };
  
  getBookById = async (c: Context) => {
    const id = c.req.param('id');
    const getBookByIdUseCase = new GetBookByIdUseCase(this.bookRepository);
    
    try {
      const book = await getBookByIdUseCase.execute(id);
      
      if (!book) {
        return c.json(
          {
            status: 404,
            message: 'Book not found',
          },
          404
        );
      }
      
      return c.json(book);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          status: 500,
          message: 'Internal Server Error',
        },
        500
      );
    }
  };
  
  createBook = async (c: Context) => {
    try {
      console.log('Creating book...');
      const body = await c.req.json();
      console.log('Received book data:', body);
      
      try {
        // 送信されたデータを適切な型に変換
        const bookData = {
          ...body,
          publishYear: body.publishYear ? parseInt(body.publishYear) : null,
          quantity: parseInt(body.quantity || '0'),
          price: body.price ? parseFloat(body.price) : null
        };
        
        console.log('Converted data:', bookData);
        
        const createBookUseCase = new CreateBookUseCase(this.bookRepository);
        const book = await createBookUseCase.execute(bookData);
        return c.json(book, 201);
      } catch (error) {
        if (error instanceof Error) {
          return c.json(
            {
              status: 400,
              message: error.message,
            },
            400
          );
        }
        
        return c.json(
          {
            status: 500,
            message: 'Internal Server Error',
          },
          500
        );
      }
    } catch (zodError) {
      console.error('Validation error:', zodError);
      return c.json(
        {
          status: 400,
          message: 'Validation failed',
          errors: zodError instanceof Error ? zodError.message : 'Unknown error',
        },
        400
      );
    }
  };
  
  updateBook = async (c: Context) => {
    const id = c.req.param('id');
    
    try {
      console.log(`Updating book with ID: ${id}`);
      const body = await c.req.json();
      console.log('Received update data:', body);
      
      try {
        // 送信されたデータを適切な型に変換
        const bookData = {
          ...body,
          publishYear: body.publishYear ? parseInt(body.publishYear) : null,
          quantity: body.quantity ? parseInt(body.quantity) : undefined,
          price: body.price ? parseFloat(body.price) : null
        };
        
        console.log('Validated update data:', bookData);
        
        const updateBookUseCase = new UpdateBookUseCase(this.bookRepository);
        const book = await updateBookUseCase.execute(id, bookData);
        
        if (!book) {
          return c.json(
            {
              status: 404,
              message: 'Book not found',
            },
            404
          );
        }
        
        return c.json(book);
      } catch (error) {
        if (error instanceof Error) {
          return c.json(
            {
              status: 400,
              message: error.message,
            },
            400
          );
        }
        
        return c.json(
          {
            status: 500,
            message: 'Internal Server Error',
          },
          500
        );
      }
    } catch (zodError) {
      console.error('Validation error:', zodError);
      return c.json(
        {
          status: 400,
          message: 'Validation failed',
          errors: zodError instanceof Error ? zodError.message : 'Unknown error',
        },
        400
      );
    }
  };
  
  deleteBook = async (c: Context) => {
    const id = c.req.param('id');
    const deleteBookUseCase = new DeleteBookUseCase(this.bookRepository);
    
    try {
      await deleteBookUseCase.execute(id);
      return c.json(null, 204);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          status: 500,
          message: 'Internal Server Error',
        },
        500
      );
    }
  };
}
