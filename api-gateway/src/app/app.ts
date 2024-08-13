import express from 'express';
import requestLogger from '../middlewares/requestLogger';
import setUpProxies from '../proxies/proxies';
import services from '../services/services';
import setUpAuth from '../auth/authenticate';



const app = express();

// log requests
app.use(requestLogger);

// authenticate request
setUpAuth(app, services);

//  set up proxy for each service
setUpProxies(app, services);






export default app;









