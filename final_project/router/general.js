
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();
const BOOKS_URL = 'http://localhost:5000/books-data';

let cachedBooks = null;

async function getBooks() {
  if (cachedBooks) {
    return cachedBooks;
  }

  const response = await axios.get(BOOKS_URL);
  cachedBooks = response.data;
  return cachedBooks;
}

public_users.get('/', async (req, res) => {
  try {
    const data = await getBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const data = await getBooks();
    const book = data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const data = await getBooks();
    const author = req.params.author.toLowerCase();

    const result = Object.values(data).filter(book =>
      book.author.toLowerCase().includes(author)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to search by author' });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const data = await getBooks();
    const title = req.params.title.toLowerCase();

    const result = Object.values(data).filter(book =>
      book.title.toLowerCase().includes(title)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to search by title' });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
