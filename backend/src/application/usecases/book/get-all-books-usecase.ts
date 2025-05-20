import { BookRepository } from '../../../domain/repositories/book-repository';
import { Book } from '../../../domain/models/book/book';

export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
