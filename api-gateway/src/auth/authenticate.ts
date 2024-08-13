import { Service } from '../services/services';
import { Express } from 'express';
import { verifyToken } from '../middlewares/validate';


const setUpAuth = (app: Express, services: Service[]) => {
  services.forEach(service => {
    if (service.auth) {
      app.use(service.path, verifyToken);
    }
  })
}

export default setUpAuth;
