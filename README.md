# 🚀 Social Media Application

A **full-stack social media application** that allows users to create accounts, make posts, interact with others, and experience a dynamic social networking platform. Built using the **MERN stack**, it provides authentication, real-time interactions, and a modern UI.

---

## 🔥 Features

✅ **User Authentication** – Secure login & registration using JWT authentication.  
✅ **Create & Manage Posts** – Users can share their thoughts through posts.  
✅ **Like & Comment System** – Engage with other users by liking and commenting.  
✅ **Profile Customization** – Users can update their bio, profile picture, and more.  
✅ **Real-time Updates** – Instant feedback when interacting with posts.  
✅ **Mobile Responsive** – Optimized for both desktop & mobile devices.  

---

## 🛠️ Setup & Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/kunalcoder45/Social-Media-App.git
cd Social-Media-App
```

### 2️⃣ Install Dependencies
#### **Backend:**
```sh
cd backend
npm install
```

#### **Frontend:**
```sh
cd frontend
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file in both the frontend and backend directories.

#### **Backend (.env)**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### **Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
```

### 4️⃣ Run the Application
#### **Backend:**
```sh
cd backend
npm start
```
#### **Frontend:**
```sh
cd frontend
npm start
```

---

## 🚀 Usage

1️⃣ **Sign up or log in** to your account.  
2️⃣ **Create a new post** by writing something and clicking **Post**.  
3️⃣ **Like and comment** on posts from other users.  
4️⃣ **Update your profile** with a new picture and bio.  
5️⃣ **Explore & interact** with the community!

---

## 🖥️ Tech Stack

**Frontend:** React.js, TailwindCSS  
**Backend:** Node.js, Express.js, MongoDB  
**Authentication:** JWT (JSON Web Tokens)  

---

## 🎯 Example API Endpoints

### 🔹 User Authentication
- **`POST /register`** – Register a new user.
- **`POST /login`** – Log in and receive a JWT token.

### 🔹 Posts Management
- **`POST /posts`** – Create a new post.
- **`GET /posts`** – Fetch all posts.
- **`POST /posts/:id/like`** – Like/unlike a post.
- **`POST /posts/:id/comment`** – Comment on a post.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to enhance this project.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💬 Contact
For any inquiries or suggestions, contact **Kunal Sharma** at:  
📧 **Email:** kunalcoder45@gmail.com  
👨‍💻 **Portfolio:** [kunalportfolio45.netlify.app](https://kunalportfolio45.netlify.app/)
