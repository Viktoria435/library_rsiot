export enum Genre {
  Fiction = 'Fiction',
  NonFiction = 'Non-Fiction',
  Mystery = 'Mystery',
  SciFi = 'Sci-Fi',
  Fantasy = 'Fantasy',
  Biography = 'Biography',
  History = 'History',
  Romance = 'Romance',
  Thriller = 'Thriller',
  Horror = 'Horror',
  Poetry = 'Poetry',
  Drama = 'Drama',
  Comics = 'Comics',
  Other = 'Other',
}

export enum BookStatus {
  AVAILABLE = 'Available',
  BORROWED = 'Borrowed',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  year: number;
  genre: Genre;
  status: BookStatus;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  pages: number;
  year: number;
  genre: Genre;
}

export interface BorrowBookRequest {
  bookIds: string[];
  visitorId: string;
  employeeId: string;
  borrowDate: string;
}

export interface ReturnBookRequest {
  bookIds: string[];
  visitorId: string;
  employeeId: string;
  returnDate: string;
}
