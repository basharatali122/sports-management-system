import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Layout
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner.jsx";

// Context
import { AuthProvider } from "./context/AuthContext.jsx"; 
import Unauthorized from "./Pages/Unauthorized.jsx";

// profile components 

// import ViewProfile from "./Components/ViewProfile.jsx";


// Protected Routing
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoutes.jsx"));

// Pages (lazy)
const Home = lazy(() => import("./Pages/Home.jsx"));
const Register = lazy(() => import("./Pages/Register.jsx"));
const Login = lazy(() => import("./Pages/Login.jsx"));
const AdminPanel = lazy(() => import("./Pages/AdminPanel.jsx"));
const CoachDashboard = lazy(() => import("./Pages/CoachDashboard.jsx"));
const ParticipantDashboard = lazy(() => import("./Pages/ParticipantDashboard.jsx"));

const AuthRedirect = lazy(() => import("./Components/AuthRedirect.jsx"));
const MemorialData = lazy(() => import("./Components/MemorialData/MemorialData.jsx"));
const NotFound = lazy(() => import("./Pages/NotFound.jsx"));

// Admin Components
const Dashboard = lazy(() => import("./Components/AdminComponents/Dashboard.jsx"));
const SendNotification = lazy(() => import("./Components/AdminComponents/SendNotification.jsx"));
const CreateEvent = lazy(() => import("./Components/AdminComponents/CreateEvent.jsx"));
const PendingEvents = lazy(() => import("./Components/AdminComponents/PendingEvents.jsx"));
const PendingTeams = lazy(() => import("./Components/AdminComponents/PendingTeams.jsx"));
const SportsCategories = lazy(() => import("./Components/AdminComponents/SportsCategories.jsx"));
const ManageUser = lazy(() => import("./Components/AdminComponents/ManageUser.jsx"));
const AdminReports = lazy(() => import("./Components/AdminComponents/Reports.jsx"));

const AdminProfiles = lazy(()=> import("./Components/AdminComponents/AdminProfiles.jsx"));

// Coach Components
const DashboardCoach = lazy(() => import("./Components/CoachComponents/Dashboard.jsx"));
const CreateTeams = lazy(() => import("./Components/CoachComponents/CreateTeams.jsx"));
const CreateEvents = lazy(() => import("./Components/CoachComponents/CreateEvents.jsx"));
const ViewUsers = lazy(() => import("./Components/CoachComponents/ManageUser.jsx"));
const CoachMessage = lazy(() => import("./Components/CoachComponents/Message.jsx"));
const CoachReports = lazy(() => import("./Components/CoachComponents/Reports.jsx"));
const CoachRegistrations = lazy(() =>
  import("./Components/CoachComponents/CoachEventRegistrations.jsx")
);

// Participant Components
const ParticipantHome = lazy(() =>
  import("./Components/ParticipantComponents/ParticipantHome.jsx")
);
const UserStatsDashboard = lazy(() =>
  import("./Components/ParticipantComponents/UserStats.jsx")
);
const RegisterForEvent = lazy(() =>
  import("./Components/ParticipantComponents/RegisterForEvent.jsx")
);
const JoinTeam = lazy(() =>
  import("./Components/ParticipantComponents/JoinTeam.jsx")
);
const UserMessage = lazy(() =>
  import("./Components/ParticipantComponents/UserMessage.jsx")
);
const Feedback = lazy(() =>
  import("./Components/ParticipantComponents/Feedback.jsx")
);
const ViewProfile = lazy(() =>
  import("./Components/ViewProfile.jsx")
);
const EditProfile = lazy(() => import("./Components/EditProfile.jsx"));

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-left" />
      <Router>
        <Navbar />
        <Suspense
          fallback={
            <div className="text-center mt-10">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {/* 🟢 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />
            <Route path="/view-profile" element={<ViewProfile/>}/>
            <Route path="/edit-profile" element={<EditProfile/>}/>

            {/* 🔵 Participant Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
              <Route path="/dashboard" element={<ParticipantDashboard />}>
                <Route index element={<ParticipantHome />} />
                <Route path="register-event" element={<RegisterForEvent />} />
                <Route path="stats" element={<UserStatsDashboard />} />
                <Route path="join-team" element={<JoinTeam />} />
                <Route path="message" element={<UserMessage />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="view-profile" element={<ViewProfile />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="memorial" element={<MemorialData />} />
              </Route>
            </Route>

            {/* 🟠 Coach Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["coach"]} />}>
              <Route path="/coach-dashboard" element={<CoachDashboard />}>
                <Route index element={<DashboardCoach />} />
                <Route path="create-teams" element={<CreateTeams />} />
                <Route path="create-events" element={<CreateEvents />} />
                <Route path="view-users" element={<ViewUsers />} />
                <Route path="messages" element={<CoachMessage />} />
                <Route path="reports" element={<CoachReports />} />
                <Route path="eventRegister" element={<CoachRegistrations />} />
              </Route>
            </Route>

            {/* 🔴 Admin Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPanel />}>
                <Route index element={<Dashboard />} />
                <Route path="user-management" element={<ManageUser />} />
                <Route path="messages" element={<SendNotification />} />
                <Route path="events" element={<CreateEvent />} />
                <Route path="pending-event" element={<PendingEvents />} />
                <Route path="pending-teams" element={<PendingTeams />} />
                <Route path="sports-categories" element={<SportsCategories />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="profiles" element={<AdminProfiles />} />
              </Route>
            </Route>

            {/* ❌ 404 */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
