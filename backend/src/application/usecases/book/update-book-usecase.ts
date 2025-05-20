import { BookRepository } from '../../../domain/repositories/book-repository';
import { Book } from '../../../domain/models/book/book';
import { UpdateBookDTO } from '../../dtos/book-dto';

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string, bookData: UpdateBookDTO): Promise<Book | null> {
    // Find book by ID
    const book = await this.bookRepository.findById(id);
    if (!book) {
      return null;
    }

    // Check if ISBN is being updated and if it's already in use
    if (bookData.isbn && bookData.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findByIsbn(bookData.isbn);
      if (existingBook && existingBook.id !== id) {
        throw new Error('Book with this ISBN already exists');
      }
    }

    // Update book properties
    if (bookData.title) {
      book.updateTitle(bookData.title);
    }
    if (bookData.author) {
      book.updateAuthor(bookData.author);
    }
    if (bookData.isbn) {
      book.updateIsbn(bookData.isbn);
    }
    book.updatePublisher(bookData.publisher);
    book.updatePublishYear(bookData.publishYear);
    book.updateDescription(bookData.description);
    if (bookData.quantity !== undefined) {
      book.updateQuantity(bookData.quantity);
    }
    book.updatePrice(bookData.price);
    book.updateImageUrl(bookData.imageUrl);
    book.updateCategory(bookData.category);

    // Save updated book
    return this.bookRepository.update(book);
  }
}
