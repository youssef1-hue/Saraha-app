# Saraha App - Backend API 🚀

A secure and scalable anonymous messaging platform backend built with Node.js and Express.js.  
The project focuses on clean architecture, authentication, data security, and professional REST API standards.

## 🌟 Features

- Implemented secure authentication flows including Signup, Login, Logout, Refresh Tokens, and Password Reset.
- Built JWT-based authentication with Access and Refresh Tokens.
- Encrypted sensitive user data such as phone numbers using AES-256 encryption.
- Integrated OTP-based Email Verification and Forgot Password flows.
- Used Redis for OTP storage, token revocation, and temporary blocking after failed attempts.
- Applied Repository Pattern to separate database logic from business logic.
- Added strict request validation using Joi.
- Improved developer experience with auto-restarting during development using Concurrently and Nodemon.

## 🛠️ Tech Stack

**Language:** JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose, Redis  
**Authentication & Security:** JWT, OAuth, OTP, bcrypt, AES-256  
**Validation:** Joi  
**Tools:** Git, GitHub, Thunder Client, Concurrently, Nodemon  

## 🚀 Getting Started

### Prerequisites

- Node.js installed v20.6.0+
- MongoDB Atlas account
- Redis server or Redis cloud account
   git clone [https://github.com/youssef1-hue/Saraha_App.git](https://github.com/youssef1-hue/Saraha_App.git)

   Navigate to the project directory:
   cd Saraha_App/Code

   Install dependencies:
   npm install

   Start in development mode:
   npm run start:dev

   API Endpoints
   Register a new user & send OTP           /auth/signup      POST
   Login and receive access token           /auth/login       POST

   📁 Project Structure
   src/modules: Auth, User, and Message logic.

src/models: Database schemas & Repositories.

src/common: Utils (Encryption, Hash, OTP)

Author
Youssef Nasr - Backend Node.js Developer
