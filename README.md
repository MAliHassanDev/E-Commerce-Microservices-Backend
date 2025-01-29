# Microservices Backend for Android E-Commerce Store  

This project is a **microservices-based backend** for an Android e-commerce store, built using **Node.js** and **Express**. It follows a **distributed architecture** with multiple services handling different business logic. An **API Gateway** is used to centralize requests, and **RabbitMQ** facilitates communication between services asynchronously.(Project is still under development)  

## 🚀 Architecture Overview  

- **User Service**: Manages user authentication, registration, and profile handling.  
- **Product Service**: Handles product listing, details, and inventory management.  
- **API Gateway**: Acts as the entry point, routing client requests to the respective services.  
- **RabbitMQ**: Used as a message broker to enable event-driven communication between services.  

## 🛠️ Technologies Used  

- **Node.js & Express** – Backend framework for all microservices.  
- **RabbitMQ** – Message broker for inter-service communication.  
- **MongoDB** – Database for storing users and products.  
- **JWT (JSON Web Tokens)** – Authentication and authorization.  
- **Docker** – Containerization for easy deployment.  
- **Redis (Optional)** – Can be used for caching user sessions or product data.  

## 📌 Features  

### 🧑‍💻 User Service  
- User registration & authentication (JWT-based).  
- Profile management (update user details, change password).  
- Secure password hashing using **bcrypt**.  

### 🛍️ Product Service  
- Create, update, delete, and fetch products.  
- Inventory management (track stock levels).  
- Searching and filtering products.  

### 🎯 API Gateway  
- Centralized entry point for all client requests.  
- Validates JWT tokens for authentication.  
- Routes requests to the appropriate microservice.  

### 🔄 Event-Driven Communication with RabbitMQ  
- **User Service → Product Service**: Notify when a user registers.  
- **Product Service → User Service**: Notify users about new product arrivals or stock updates.  

## 🚀 Setup & Installation  

### Prerequisites  
- **Node.js** (>= 14.x)  
- **MongoDB** (local or cloud)  
- **RabbitMQ** (running locally or in Docker)  
- **Docker (optional)**  

### Steps to Set Up  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/ecommerce-microservices.git
   cd ecommerce-microservices
   ```

2. **Set up environment variables**  
   Create a `.env` file for each service (`user-service/.env`, `product-service/.env`, `api-gateway/.env`) with the following keys:  

   ```env
   # Example for User Service
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/users
   JWT_SECRET=your_jwt_secret
   RABBITMQ_URI=amqp://localhost
   ```

3. **Install dependencies for each service**  
   ```bash
   cd user-service && npm install
   cd ../product-service && npm install
   cd ../api-gateway && npm install
   ```

4. **Start RabbitMQ (if using Docker)**  
   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
   ```

5. **Start the microservices**  
   Open separate terminals and run:  
   ```bash
   cd user-service && npm run dev
   cd ../product-service && npm run dev
   cd ../api-gateway && npm run dev
   ```

## 📡 API Endpoints  

### 🧑 User Service  
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/register` | Register a new user |
| POST   | `/login` | Authenticate user and return JWT |
| GET    | `/profile` | Get user profile (Requires JWT) |

### 🛒 Product Service  
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/products` | Fetch all products |
| POST   | `/products` | Add a new product (Admin only) |
| GET    | `/products/:id` | Get product details |

### 🚪 API Gateway  
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/users/register` | Proxy to User Service |
| GET    | `/api/products` | Proxy to Product Service |

## 🛠️ Future Enhancements  
- **Order & Payment Service**: Handle checkout and payments.  
- **Admin Panel**: Dashboard for managing products and users.  
- **Notifications Service**: Send push notifications and emails.  

## 📝 License  
This project is licensed under the MIT License.  

---
