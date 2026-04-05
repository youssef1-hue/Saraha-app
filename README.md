# Saraha App - Backend API 🚀

A secure and scalable anonymous messaging platform backend built with **Node.js**, **Express**, and **TypeScript**. This project focuses on clean architecture, data security, and professional API standards.

## 🌟 Features
- **User Authentication:** Complete Signup/Login flow with JWT and password hashing.
- **Data Encryption:** Sensitive fields like phone numbers are encrypted at rest using AES-256.
- **Email Verification:** Integrated OTP-based verification for new registrations.
- **Repository Pattern:** Separated database logic from business logic for better maintainability.
- **Validation:** Strict request data validation using **Joi**.
- **Developer Experience:** Real-time TypeScript compilation and auto-restarting using `concurrently`.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Security:** Bcrypt, CryptoJS, JWT
- **Tooling:** Git, Thunder Client, Concurrently

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v20.6.0+).
- MongoDB Atlas account.

### Installation & Run
1. Clone the repository:
   ```bash
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