import { readFileSync } from "fs";
export interface Book {
  title: string;
  description: string;
  author: string;
  publisher: string;
  category: string;
  language: string;
  total_pages: number;
  cover: string;
}

export const listBooks = async () => {
  const data = await JSON.parse(readFileSync("data.json", "utf8"));
  const books: Book[] = data.books;
  return books;
};
