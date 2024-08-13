import express from 'express';
import userRoutes from '../routes/userRoutes.ts'
import requestLogger from '../middlewares/requestLogger.ts';

const app = express();



// don't identify express
app.disable('x-powered-by');

// parse json req body
app.use(express.json());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// log incoming requests
app.use(requestLogger);


app.use('/', userRoutes);
export default app;