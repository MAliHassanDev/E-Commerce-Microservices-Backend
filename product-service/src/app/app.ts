import express from 'express';
import { requestLogger ,errorHandler} from '../middlewares/middlewares.ts';
import productRoutes from '../routes/productRoutes.ts';


const app = express();


// don't identify express
app.disable('x-powered-by');

// parse json req body
app.use(express.json());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// log incoming requests
app.use(requestLogger);

// use product routes
app.use('/products', productRoutes);

// handle uncaught errors
app.use(errorHandler);


export default app;