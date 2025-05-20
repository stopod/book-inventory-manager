import { Hono } from 'hono';
import { BookController } from '../controllers/book-controller';

export const bookRouter = new Hono();
const bookController = new BookController();

bookRouter.get('/', bookController.getAllBooks);
bookRouter.get('/:id', bookController.getBookById);
bookRouter.post('/', bookController.createBook);
bookRouter.put('/:id', bookController.updateBook);
bookRouter.delete('/:id', bookController.deleteBook);
