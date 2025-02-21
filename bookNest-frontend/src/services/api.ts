import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const registerUser = (data: { name: string; email: string; password: string }) => API.post("/auth/register", data);
export const loginUser = (data: { email: string; password: string }) => API.post("/auth/login", data);
export const fetchBooks = (token: string) => API.get("/books", { headers: { Authorization: `Bearer ${token}` } });
export const addBook = (token: string, title: string) =>
  API.post("/books", { title }, { headers: { Authorization: `Bearer ${token}` } });
export const updateBook = (token: string, id: string, data: any) =>
  API.put(`/books/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
