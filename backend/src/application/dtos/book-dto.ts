export interface BookDTO {
  id: string;
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

export interface CreateBookDTO {
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
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  description?: string;
  quantity?: number;
  price?: number;
  imageUrl?: string;
  category?: string;
}
