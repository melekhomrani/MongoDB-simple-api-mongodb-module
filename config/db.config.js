import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_KEY = process.env.MONGODB_KEY;

const url = `mongodb+srv://admin:${MONGODB_KEY}@cluster0.zsocg.mongodb.net/books?retryWrites=true&w=majority`;

let dbConnection;

export function connectDB(callbackFn) {
  MongoClient.connect(url)
    .then((client) => {
      dbConnection = client.db();
      return callbackFn();
    })
    .catch((err) => {
      console.log(err);
      return callbackFn(err);
    });
}

export function getDb() {
  return dbConnection;
}
