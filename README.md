# DevConnect 🔗

A full-stack developer-focused social network for sharing thoughts, connecting with others, and building community. Think "X (Twitter) meets Dev.to" — but for your own projects.

## 🛠 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Supabase Auth
- **State Management**: React Context
- **Styling**: Custom CSS

---

## 📦 Features

- 🔐 Supabase JWT Authentication (signup/login/logout)
- 📝 Create new posts (text-only for now)
- 🧑 View posts from all users
- 🧪 JWT verification middleware on backend
- 🚫 Real-time error handling & protection routes

---

## 🧰 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/devconnect.git
cd devconnect
```

### 2. Setup Environment Variables

Create a `.env` file in the root of your **server** folder:

```env
MONGO_URI=your_mongodb_uri
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> Get your service role key from Supabase > Project Settings > API.

### 3. Install Dependencies

Install server packages:

```bash
cd server
npm install
```

Install client packages:

```bash
cd ../client
npm install
```

### 4. Run the App

Start the backend:

```bash
cd server
nodemon server.js
```

Start the frontend:

```bash
cd ../client
npm run dev
```

> Vite will default to `http://localhost:5173`, and your API should run on `http://localhost:8080`.

---

## 📂 Folder Structure

```
/client           # React app
  /components
  /pages
  App.jsx
  main.jsx

/server           # Express backend
  /models
  /routes
  server.js
  supabaseclient.js

.env              # For backend secrets
```

---

## 🔒 Supabase Auth Integration

- Auth token is retrieved on frontend and sent via the `Authorization: Bearer <token>` header
- Middleware on backend verifies token using `supabase.auth.getUser(token)`
- Posts are only accepted if the token is valid

---

## 🚀 What's Next?

- Add profile pages with avatar + bio
- Commenting & liking posts
- File uploads with Cloudinary
- Notifications (WebSocket with Socket.IO)

---
