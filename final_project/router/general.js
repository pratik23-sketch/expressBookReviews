
const express = require('express');
const axios = require('axios');
const { generalBooks } = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();
const BOOKS_URL = 'http://localhost:5000/books-data';

let cachedBooks;

async function getBooks() {
  if (cachedBooks) return cachedBooks;

  const response = await axios.get(BOOKS_URL);
  cachedBooks = response.data;
  return cachedBooks;
}

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: 'User successfully registered'
  });
});

public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(await getBooks());
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books'
    });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const books = await getBooks();
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve book by ISBN'
    });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const books = await getBooks();
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(book =>
      book.author.toLowerCase().includes(author)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by author'
    });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const books = await getBooks();
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(title)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve books by title'
    });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = require('./booksdb.js')[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
