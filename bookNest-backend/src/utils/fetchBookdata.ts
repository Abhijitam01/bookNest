import axios from "axios";

const fetchBookData = async (title: string) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
    const book = response.data.items?.[0]?.volumeInfo;
    return book ? { title: book.title, author: book.authors?.[0], description: book.description } : null;
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
};

export default fetchBookData;
