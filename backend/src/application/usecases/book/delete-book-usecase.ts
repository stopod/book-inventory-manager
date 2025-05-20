import { BookRepository } from '../../../domain/repositories/book-repository';

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
