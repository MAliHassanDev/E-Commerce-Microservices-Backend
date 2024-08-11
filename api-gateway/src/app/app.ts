import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware'



const app = express();





// user service proxy
const userServiceProxy = createProxyMiddleware({
  target: '',
  changeOrigin: true,
})

app.use('/api/v1/users', userServiceProxy);










