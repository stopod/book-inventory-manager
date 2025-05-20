import { PrismaClient } from '@prisma/client';
import { Book, BookProps } from '../../domain/models/book/book';
import { BookRepository } from '../../domain/repositories/book-repository';

export class PrismaBookRepository implements BookRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Book[]> {
    const books = await this.prisma.book.findMany();

    return books.map((book) =>
      Book.create(
        {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publisher: book.publisher || undefined,
          publishYear: book.publishYear || undefined,
          description: book.description || undefined,
          quantity: book.quantity,
          price: book.price || undefined,
          imageUrl: book.imageUrl || undefined,
          category: book.category || undefined,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        },
        book.id
      )
    );
  }

  async findById(id: string): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return null;
    }

    return Book.create(
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher || undefined,
        publishYear: book.publishYear || undefined,
        description: book.description || undefined,
        quantity: book.quantity,
        price: book.price || undefined,
        imageUrl: book.imageUrl || undefined,
        category: book.category || undefined,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
      book.id
    );
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
    });

    if (!book) {
      return null;
    }

    return Book.create(
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher || undefined,
        publishYear: book.publishYear || undefined,
        description: book.description || undefined,
        quantity: book.quantity,
        price: book.price || undefined,
        imageUrl: book.imageUrl || undefined,
        category: book.category || undefined,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
      book.id
    );
  }

  async save(book: Book): Promise<Book> {
    const bookProps = book.props as BookProps;

    const createdBook = await this.prisma.book.create({
      data: {
        id: book.id,
        title: bookProps.title,
        author: bookProps.author,
        isbn: bookProps.isbn,
        publisher: bookProps.publisher,
        publishYear: bookProps.publishYear,
        description: bookProps.description,
        quantity: bookProps.quantity,
        price: bookProps.price,
        imageUrl: bookProps.imageUrl,
        category: bookProps.category,
        createdAt: bookProps.createdAt,
        updatedAt: bookProps.updatedAt,
      },
    });

    return Book.create(
      {
        title: createdBook.title,
        author: createdBook.author,
        isbn: createdBook.isbn,
        publisher: createdBook.publisher || undefined,
        publishYear: createdBook.publishYear || undefined,
        description: createdBook.description || undefined,
        quantity: createdBook.quantity,
        price: createdBook.price || undefined,
        imageUrl: createdBook.imageUrl || undefined,
        category: createdBook.category || undefined,
        createdAt: createdBook.createdAt,
        updatedAt: createdBook.updatedAt,
      },
      createdBook.id
    );
  }

  async update(book: Book): Promise<Book> {
    const bookProps = book.props as BookProps;

    const updatedBook = await this.prisma.book.update({
      where: { id: book.id },
      data: {
        title: bookProps.title,
        author: bookProps.author,
        isbn: bookProps.isbn,
        publisher: bookProps.publisher,
        publishYear: bookProps.publishYear,
        description: bookProps.description,
        quantity: bookProps.quantity,
        price: bookProps.price,
        imageUrl: bookProps.imageUrl,
        category: bookProps.category,
        updatedAt: bookProps.updatedAt,
      },
    });

    return Book.create(
      {
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        publisher: updatedBook.publisher || undefined,
        publishYear: updatedBook.publishYear || undefined,
        description: updatedBook.description || undefined,
        quantity: updatedBook.quantity,
        price: updatedBook.price || undefined,
        imageUrl: updatedBook.imageUrl || undefined,
        category: updatedBook.category || undefined,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
      },
      updatedBook.id
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({
      where: { id },
    });
  }
}
