import express from 'express';
import bookRouter from './routes/book.route.js';

const PORT = process.env.PORT || 3000;

// init app and middleware
const app = express();

app.use(express.json());

// routes
app.use(bookRouter);

//
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
