import express from 'express';
import { errorHandler} from '../middlewares/middlewares.ts';
import morgan from 'morgan';
import productRoutes from '../routes/productRoutes.ts';
import cors from 'cors'


const app = express();

// don't identify express
app.disable('x-powered-by');

// parse json req body
app.use(express.json());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// log incoming requests
app.use(morgan('dev'));

// use product routes
app.use('/products', productRoutes);

// handle uncaught errors
app.use(errorHandler);


export default app;