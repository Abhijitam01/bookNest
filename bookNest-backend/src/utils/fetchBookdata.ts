import axios from "axios";

interface BookData {
  title: string;
  author: string;
  coverImage?: string;
}

async function fetchBookData(title: string): Promise<BookData | null> {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
    const book = response.data.items?.[0]?.volumeInfo;
    return book ? { title: book.title, author: book.authors?.[0], coverImage: book.imageLinks?.thumbnail } : null;
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
}

export default fetchBookData;
