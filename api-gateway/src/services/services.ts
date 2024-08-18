import { Options } from "http-proxy-middleware"

export interface RateLimit{
  timeInterval: number,
  maxRequests: number,
}

export interface Service{
  path: string | RegExp,
  auth: boolean,
  rateLimit: RateLimit,
  proxy: Options,
}


const services: Array<Service> = [
  {
    path: '/api/users',
    auth: false,
    rateLimit: {
      timeInterval: 15 * 60 * 1000, // 15 minutes,
      maxRequests: 10,
    },
    proxy: {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/users': '/users'
      },
      pathFilter(pathname, req) {
        return /^\/api\/users\/(?:signin|signup)$/.test(pathname) && req.method === "POST";
      },
    }
  },
  {
    path: "/api/products",
    auth: false,
    rateLimit: {
      timeInterval: 15 * 60 * 1000, // 15 minutes,
      maxRequests: 10, 
    },
    proxy: {
      target: 'http://127.0.0.1:3002',
      changeOrigin: true,
      pathRewrite: {
        '^/api/products': '/products'
      },
    }
  }
]






export default services;