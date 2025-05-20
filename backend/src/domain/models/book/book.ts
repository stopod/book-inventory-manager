import { Entity } from '../shared/entity';

export interface BookProps {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  description?: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Book extends Entity<BookProps> {
  private constructor(props: BookProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Partial<BookProps> & { title: string; author: string; isbn: string },
    id?: string
  ): Book {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Book title cannot be empty');
    }

    if (!props.author || props.author.trim().length === 0) {
      throw new Error('Book author cannot be empty');
    }

    if (!props.isbn || props.isbn.trim().length === 0) {
      throw new Error('Book ISBN cannot be empty');
    }

    const bookProps: BookProps = {
      title: props.title,
      author: props.author,
      isbn: props.isbn,
      publisher: props.publisher,
      publishYear: props.publishYear,
      description: props.description,
      quantity: props.quantity ?? 0,
      price: props.price,
      imageUrl: props.imageUrl,
      category: props.category,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new Book(bookProps, id);
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get author(): string {
    return this.props.author;
  }

  get isbn(): string {
    return this.props.isbn;
  }

  get publisher(): string | undefined {
    return this.props.publisher;
  }

  get publishYear(): number | undefined {
    return this.props.publishYear;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get price(): number | undefined {
    return this.props.price;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get category(): string | undefined {
    return this.props.category;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Methods
  public updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Book title cannot be empty');
    }

    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  public updateAuthor(author: string): void {
    if (!author || author.trim().length === 0) {
      throw new Error('Book author cannot be empty');
    }

    this.props.author = author;
    this.props.updatedAt = new Date();
  }

  public updateIsbn(isbn: string): void {
    if (!isbn || isbn.trim().length === 0) {
      throw new Error('Book ISBN cannot be empty');
    }

    this.props.isbn = isbn;
    this.props.updatedAt = new Date();
  }

  public updatePublisher(publisher?: string): void {
    this.props.publisher = publisher;
    this.props.updatedAt = new Date();
  }

  public updatePublishYear(publishYear?: number): void {
    this.props.publishYear = publishYear;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  public updateQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Book quantity cannot be negative');
    }

    this.props.quantity = quantity;
    this.props.updatedAt = new Date();
  }

  public increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    this.props.quantity += amount;
    this.props.updatedAt = new Date();
  }

  public decreaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (this.props.quantity < amount) {
      throw new Error('Not enough quantity available');
    }

    this.props.quantity -= amount;
    this.props.updatedAt = new Date();
  }

  public updatePrice(price?: number): void {
    this.props.price = price;
    this.props.updatedAt = new Date();
  }

  public updateImageUrl(imageUrl?: string): void {
    this.props.imageUrl = imageUrl;
    this.props.updatedAt = new Date();
  }

  public updateCategory(category?: string): void {
    this.props.category = category;
    this.props.updatedAt = new Date();
  }

  public isAvailable(): boolean {
    return this.props.quantity > 0;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
