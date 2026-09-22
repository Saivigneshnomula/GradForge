import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Roadmaps from "./pages/Roadmap";
import RoadmapDetails from "./pages/RoadmapDetails";
import Profile from "./pages/Profile";

import Community from "./pages/Community";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";

import AskSolve from "./pages/AskSolve";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionDetails from "./pages/QuestionDetails";

import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import MyContributions from "./pages/MyContributions";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";

import BecomeMentor from "./pages/BecomeMentor";
import MentorProfile from "./pages/MentorProfile";

import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPrep from "./pages/InterviewPrep";
import Admin from "./pages/Admin";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* ================= ROADMAPS ================= */}

          <Route
            path="/roadmaps"
            element={
              <ProtectedRoute>
                <Roadmaps />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmaps/:id"
            element={
              <ProtectedRoute>
                <RoadmapDetails />
              </ProtectedRoute>
            }
          />


          {/* ================= PROFILE ================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* ================= COMMUNITY ================= */}

          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community/:id"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />


          {/* ================= ASK & SOLVE ================= */}

          <Route
            path="/ask-solve"
            element={
              <ProtectedRoute>
                <AskSolve />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ask-solve/create"
            element={
              <ProtectedRoute>
                <CreateQuestion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ask-solve/:id"
            element={
              <ProtectedRoute>
                <QuestionDetails />
              </ProtectedRoute>
            }
          />


          {/* ================= PROJECT HUB ================= */}

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/my"
            element={
              <ProtectedRoute>
                <MyContributions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />


          {/* ================= MENTOR ================= */}

          <Route
            path="/become-mentor"
            element={
              <ProtectedRoute>
                <BecomeMentor />
              </ProtectedRoute>
            }
          />
{/* ================= RESUME BUILDER ================= */}

<Route
  path="/resume-builder"
  element={
    <ProtectedRoute>
      <ResumeBuilder />
    </ProtectedRoute>
  }
/>

{/* ================= INTERVIEW PREPARATION ================= */}

<Route
  path="/interview-prep"
  element={
    <ProtectedRoute>
      <InterviewPrep />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>
          {/* ================= DEFAULT ================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
  path="/mentor-profile"
  element={
    <ProtectedRoute>
      <MentorProfile />
    </ProtectedRoute>
  }
/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;