import { BookRepository } from '../../../domain/repositories/book-repository';
import { Book } from '../../../domain/models/book/book';

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string): Promise<Book | null> {
    return this.bookRepository.findById(id);
  }
}
