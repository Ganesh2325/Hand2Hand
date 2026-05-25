# Hand2Hand – Campus Help Network 🚀

Hand2Hand is a premium, production-grade peer-to-peer campus delivery and student assistance platform. It enables students to share travel routes and assist peers by delivering small items across campus, fostering a collaborative and secure community.

## ✨ Features

- **World-Class UI/UX**: Premium light-theme design system with glassmorphism, pastel gradients, and sophisticated animations.
- **Smart Route Matching**: Intelligent logic to suggest travelers on overlapping paths.
- **Secure OTP Verification**: Two-factor verification for safe item handover.
- **Real-time Notifications**: Instant updates on matches and delivery status via Socket.IO.
- **Gamified Reputation**: Trust scores, badges (Campus Hero, Trusted Helper), and global leaderboards.
- **Full Auth System**: Secure student registration and login with JWT and bcrypt.
- **Mobile First**: Fully responsive design optimized for all devices.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS 4, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express.js, Socket.IO.
- **Database**: MongoDB Atlas, Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hand2hand.git
   cd hand2hand
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_key
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design System

Hand2Hand uses a strict premium palette:
- **Sky Blue**: #7CC6FE
- **Lavender**: #CDB4FF
- **Soft Pink**: #FFC8DD
- **Mint Green**: #B8F2E6
- **Peach Cream**: #FFD6C9

## 🛡 Security

- JWT-based authentication.
- Password hashing with Bcrypt.
- Input validation and sanitization.
- Secure real-time communication via Socket.IO rooms.

## 📜 License

Built for students, by students. Distributed under the MIT License.
