import { BookRepository } from '../../../domain/repositories/book-repository';
import { Book } from '../../../domain/models/book/book';
import { CreateBookDTO } from '../../dtos/book-dto';

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(bookData: CreateBookDTO): Promise<Book> {
    // Check if book with this ISBN already exists
    const existingBook = await this.bookRepository.findByIsbn(bookData.isbn);
    if (existingBook) {
      throw new Error('Book with this ISBN already exists');
    }

    // Create book entity
    const book = Book.create(bookData);

    // Save book
    return this.bookRepository.save(book);
  }
}
