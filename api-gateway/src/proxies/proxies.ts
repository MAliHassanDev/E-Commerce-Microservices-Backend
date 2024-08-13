import { Express } from "express"
import { Service } from "../services/services"
import {createProxyMiddleware} from 'http-proxy-middleware'


const setUpProxies = (app: Express, services: Service[]) => (
  services.forEach(service => {
    app.use(createProxyMiddleware(service.proxy));
  })
)

export default setUpProxies;