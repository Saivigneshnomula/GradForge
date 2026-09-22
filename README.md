GradForge 🚀

Forge Your Future

GradForge is a student-focused career and project platform that brings
learning, projects, career preparation, opportunities, interview
preparation, mentors, resume building, and student community features
into one place.

🌐 Project Links

Live Website: https://grad-forge.vercel.app

GitHub Repository: https://github.com/Saivigneshnomula/GradForge

Project Walkthrough Video:
https://drive.google.com/file/d/1g8thdMrbeM-HebftW7HkFPp2P9AWCq8f/view?usp=sharing

Backend API: https://gradforge.onrender.com

✨ Key Features

🎓 Student Profile

Personalized student profile

Education details

Skills, interests, and career goals

Projects, certifications, achievements, and contributions

LinkedIn and GitHub profiles

💻 Project Hub

Showcase and manage student projects

Project information and documentation

Helps students present their technical work

📚 Interview Preparation

Interview questions organized by category

Difficulty-based preparation

Search functionality

Technical and HR preparation

💼 Jobs & Opportunities

Discover job opportunities

Search and filter opportunities

View company, location, skills, salary, deadlines, and application
links

🏆 Hackathons

Discover hackathons

View prizes, deadlines, themes, and details

Direct registration/application links

🤝 Mentor System

Explore mentors

Mentor profiles

Mentor applications and guidance

📄 Resume Builder

Organize professional information

Build a structured resume from profile data

💬 Ask & Solve

Student community questions

Categories and discussions

Answers and community interaction

🔐 Authentication & Admin

JWT-based authentication

Student and admin roles

Protected API routes

Admin management for interview questions, jobs, and hackathons

🛠️ Tech Stack

Frontend

React.js

Vite

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

CORS

dotenv

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

🏗️ Architecture

React + Vite (Vercel)
        │
        │ REST API
        ▼
Node.js + Express (Render)
        │
        │ Mongoose
        ▼
MongoDB Atlas

📁 Project Structure

GradForge/
├── client/
│   └── React + Vite frontend
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
│
└── README.md

🚀 Run Locally

1. Clone the repository

git clone https://github.com/Saivigneshnomula/GradForge.git
cd GradForge

2. Start the backend

cd server
npm install
npm run dev

Backend:

http://localhost:5000

3. Start the frontend

Open another terminal:

cd client
npm install
npm run dev

Frontend:

http://localhost:5173

🔑 Environment Variables

Backend

Create server/.env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend

Create client/.env:

VITE_API_URL=http://localhost:5000/api

For production:

VITE_API_URL=https://gradforge.onrender.com/api

Never commit .env files, database passwords, JWT secrets, or other
private credentials to GitHub.

🎯 Purpose

GradForge gives students a centralized platform to:

Learn → Build → Prepare → Discover Opportunities → Connect → Get
Hired

👨‍💻 Project

GradForge --- Forge Your Future

Built as a full-stack MERN project for students and career development.
