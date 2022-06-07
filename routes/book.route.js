import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB, getDb } from '../config/db.config.js';
const router = express.Router();

// db connection
let db;
connectDB((err) => {
  if (!err) {
    db = getDb();
    console.log('connected to db');
  }
});

router.post('/api/books', (req, res) => {
  db.collection('books')
    .insertOne(req.body)
    .then(() => {
      res.status(201).json({ msg: 'book created successfully' });
    })
    .catch((err) =>
      res.status(500).json({
        msg: 'cannot create book with this id',
        error: err,
      })
    );
});

router.patch('/api/books/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id)) res.status(500).json('id is invalid');

  db.collection('books')
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body })
    .then(() => res.status(200).json({ msg: 'book updated successfully' }))
    .catch((err) =>
      res.status(500).json({
        msg: 'cannot update book with this id',
        error: err,
      })
    );
});

router.delete('/api/books/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id)) res.status(500).json('id is invalid');

  db.collection('books')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.status(200).json('doc is delelted'))
    .catch((err) =>
      res.status(500).json({
        msg: 'cannot delete book with this id',
        error: err,
      })
    );
});

router.get('/api/books/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id)) res.status(500).json('id is invalid');
  db.collection('books')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(
      (doc) =>
        (doc && res.status(200).json(doc)) ||
        res.status(404).json({ msg: 'book is not found' })
    )
    .catch((err) =>
      res.status(500).json({
        msg: 'cannot get book with this id',
        error: err,
      })
    );
});

router.get('/api/books', (req, res) => {
  const booksPerPage = 3;
  let arr = [];
  db.collection('books')
    .find()
    .sort({ rating: -1 })
    .skip(req.query.p * 3)
    .limit(booksPerPage)
    .forEach((book) => arr.push(book))
    .then(() => {
      (arr && res.status(200).json(arr)) ||
        res.status(404).json({ msg: 'no book found' });
    })
    .catch((err) =>
      res.status(500).json({
        msg: 'cannot get all books',
        error: err,
      })
    );
});

export default router;
