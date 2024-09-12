import { Express, Request } from "express"
import { Service } from "../services/services.ts"
import {createProxyMiddleware} from 'http-proxy-middleware'
import { NextFunction } from "http-proxy-middleware/dist/types.js";


const setUpProxies = (app: Express, services: Service[]) => (
  services.forEach(service => {
    app.use(createProxyMiddleware(service.proxy));
  })
)


export default setUpProxies;

