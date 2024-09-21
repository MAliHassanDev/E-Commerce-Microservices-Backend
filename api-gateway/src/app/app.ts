import express from 'express';
import {requestLogger,errorHandler} from '../middlewares/middlewares.ts';
import setUpProxies from '../proxies/proxies.ts';
import services from '../services/services.ts';
import setUpAuth from '../auth/authenticate.ts';
import morgan from 'morgan';


const app = express();

// log requests
app.use(morgan('dev'));

// authenticate request
setUpAuth(app, services);

//  set up proxy for each service
setUpProxies(app, services);



// handle uncaught errors
app.use(errorHandler);




export default app;









