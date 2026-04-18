#  HuntBoard

HuntBoard is a web app I built to track job and internship applications in a simple and organized way. Instead of using spreadsheets or notes, this uses a Kanban-style board to manage applications across different stages.

---

##  Live Links

* Frontend: https://huntboard-rvw8.onrender.com
* Backend: https://huntboard-backend.onrender.com

---

##  What it does

* Create and track job applications
* Move applications across stages (Applied, Interview, etc.)
* Signup/Login with authentication
* Update profile and manage details
* Basic notifications system

---

##  Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Zustand
* Axios

**Backend**

* Node.js
* Express
* MongoDB Atlas
* JWT Authentication

**Deployment**

* Render (both frontend & backend)

---

##  Project Structure

```
huntboard/
├── client/   # frontend
├── server/   # backend
```

---

##  Environment Variables

### Backend

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=https://huntboard-rvw8.onrender.com
```

### Frontend

```
VITE_API_URL=https://huntboard-backend.onrender.com
```

---

##  Running locally

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm run dev
```

---

##  Notes

* Free Render services may take a few seconds to wake up
* Faced CORS issues during deployment (fixed using env variables)
* MongoDB Atlas used for cloud database

---

##  Team

* Vaishnavi Bairagoni
* Sasya Thatikonda
* Rishitha Kunchala
* Archana Kashaboina

---

##  Why I built this

Managing job applications manually gets messy really fast.
So I wanted to build something simple, visual, and actually useful — and this is what came out of it.

---

## 


