
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();

public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: 'Unable to retrieve book' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(book =>
      book.author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to search by author' });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(book =>
      book.title.toLowerCase().includes(req.params.title.toLowerCase())
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
