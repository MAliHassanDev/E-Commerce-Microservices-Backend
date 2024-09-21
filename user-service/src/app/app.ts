import express from 'express';
import userRoutes from '../routes/userRoutes.ts'
import morgan from 'morgan';
import { errorHandler } from '../middlewares/middlewares.ts';

const app = express();



// don't identify express
app.disable('x-powered-by');

// parse json req body
app.use(express.json());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// log incoming requests
app.use(morgan('dev'));

//  set routes
app.use('/users', userRoutes);

// handle uncaught errors
app.use(errorHandler);

export default app;