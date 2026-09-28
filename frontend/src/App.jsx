
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import Applicants from "./pages/Applicants";
import EditJob from "./pages/EditJob";

import Talent from "./pages/Talent";
import TalentProfile from "./pages/TalentProfile";

import NotFound from "./pages/NotFound";


function App() {
    return (
        <div className="min-h-screen bg-white text-slate-900">

            <Navbar />

            <main>
                <Routes>

                    {/* =========================
                        PUBLIC ROUTES
                    ========================== */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/jobs"
                        element={<Jobs />}
                    />

                    <Route
                        path="/jobs/:id"
                        element={<JobDetails />}
                    />

<Route
    path="/jobs/:id/apply"
    element={
        <ProtectedRoute
            allowedRole="student"
        >
            <ApplyJob />
        </ProtectedRoute>
    }
/>


                    {/* =========================
                        STUDENT ROUTES
                    ========================== */}

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute
                                allowedRole="student"
                            >
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute
                                allowedRole="student"
                            >
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/saved-jobs"
                        element={
                            <ProtectedRoute
                                allowedRole="student"
                            >
                                <SavedJobs />
                            </ProtectedRoute>
                        }
                    />


                    {/* =========================
                        RECRUITER ROUTES
                    ========================== */}

                    <Route
                        path="/recruiter/dashboard"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <RecruiterDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/jobs/new"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <PostJob />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/jobs/:id/edit"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <EditJob />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/applicants"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <Applicants />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/talent"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <Talent />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/talent/:id"
                        element={
                            <ProtectedRoute
                                allowedRole="recruiter"
                            >
                                <TalentProfile />
                            </ProtectedRoute>
                        }
                    />


                    {/* =========================
                        404
                    ========================== */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>
            </main>

            <Footer />

        </div>
    );
}

export default App;

