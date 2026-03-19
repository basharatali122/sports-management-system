


// import React, { Suspense, lazy } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
// } from "react-router-dom";
// import { Toaster } from "sonner";
// import { Provider } from "react-redux";
// import { store } from "./store/store";

// // Layout
// import Navbar from "./Components/Navbar.jsx";
// import Footer from "./Components/Footer.jsx";
// import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner.jsx";

// // Context - import both provider and hook
// import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
// import Unauthorized from "./Pages/Unauthorized.jsx";

// // Chat Components
// import ChatLauncher from "./Components/Chat/ChatLauncher.jsx";
// import UserMessage from "./Components/Chat/UserMessage.jsx";
// import CoachMessage from "./Components/Chat/CoachMessage.jsx";
// import SendNotification from "./Components/Chat/SendNotification.jsx";

// // Protected Routing
// const ProtectedRoute = lazy(() => import("./routes/ProtectedRoutes.jsx"));

// // Pages (lazy)
// const Home = lazy(() => import("./Pages/Home.jsx"));
// const Register = lazy(() => import("./Pages/Register.jsx"));
// const Login = lazy(() => import("./Pages/Login.jsx"));
// const AdminPanel = lazy(() => import("./Pages/AdminPanel.jsx"));
// const CoachDashboard = lazy(() => import("./Pages/CoachDashboard.jsx"));
// const ParticipantDashboard = lazy(() => import("./Pages/ParticipantDashboard.jsx"));

// const AuthRedirect = lazy(() => import("./Components/AuthRedirect.jsx"));
// const MemorialData = lazy(() => import("./Components/MemorialData/MemorialData.jsx"));
// const NotFound = lazy(() => import("./Pages/NotFound.jsx"));

// // Admin Components
// const Dashboard = lazy(() => import("./Components/AdminComponents/Dashboard.jsx"));
// const CreateEvent = lazy(() => import("./Components/AdminComponents/CreateEvent.jsx"));
// const PendingEvents = lazy(() => import("./Components/AdminComponents/PendingEvents.jsx"));
// const PendingTeams = lazy(() => import("./Components/AdminComponents/PendingTeams.jsx"));
// const SportsCategories = lazy(() => import("./Components/AdminComponents/SportsCategories.jsx"));
// const ManageUser = lazy(() => import("./Components/AdminComponents/ManageUser.jsx"));
// const AdminReports = lazy(() => import("./Components/AdminComponents/Reports.jsx"));
// const AdminProfiles = lazy(() => import("./Components/AdminComponents/AdminProfiles.jsx"));

// // Coach Components
// const DashboardCoach = lazy(() => import("./Components/CoachComponents/Dashboard.jsx"));
// const CreateTeams = lazy(() => import("./Components/CoachComponents/CreateTeams.jsx"));
// const CreateEvents = lazy(() => import("./Components/CoachComponents/CreateEvents.jsx"));
// const ViewUsers = lazy(() => import("./Components/CoachComponents/ManageUser.jsx"));
// const CoachReports = lazy(() => import("./Components/CoachComponents/Reports.jsx"));
// const CoachRegistrations = lazy(() =>
//   import("./Components/CoachComponents/CoachEventRegistrations.jsx")
// );

// // Participant Components
// const ParticipantHome = lazy(() =>
//   import("./Components/ParticipantComponents/ParticipantHome.jsx")
// );
// const UserStatsDashboard = lazy(() =>
//   import("./Components/ParticipantComponents/UserStats.jsx")
// );
// const RegisterForEvent = lazy(() =>
//   import("./Components/ParticipantComponents/RegisterForEvent.jsx")
// );
// const JoinTeam = lazy(() =>
//   import("./Components/ParticipantComponents/JoinTeam.jsx")
// );
// const Feedback = lazy(() =>
//   import("./Components/ParticipantComponents/Feedback.jsx")
// );
// const ViewProfile = lazy(() =>
//   import("./Components/ViewProfile.jsx")
// );
// const EditProfile = lazy(() => import("./Components/EditProfile.jsx"));

// // Create a separate component that uses the auth hook
// function AppContent() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Suspense
//         fallback={
//           <div className="text-center mt-10">
//             <LoadingSpinner />
//           </div>
//         }
//       >
//         <Routes>
//           {/* 🟢 Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/auth-redirect" element={<AuthRedirect />} />
//           <Route path="/view-profile" element={<ViewProfile />} />
//           <Route path="/edit-profile" element={<EditProfile />} />

//           {/* 🔵 Participant Dashboard */}
//           <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
//             <Route path="/dashboard" element={<ParticipantDashboard />}>
//               <Route index element={<ParticipantHome />} />
//               <Route path="register-event" element={<RegisterForEvent />} />
//               <Route path="stats" element={<UserStatsDashboard />} />
//               <Route path="join-team" element={<JoinTeam />} />
//               <Route path="messages" element={<UserMessage />} />
//               <Route path="edit-profile" element={<EditProfile />} />
//               <Route path="view-profile" element={<ViewProfile />} />
//               <Route path="feedback" element={<Feedback />} />
//               <Route path="memorial" element={<MemorialData />} />
//             </Route>
//           </Route>

//           {/* 🟠 Coach Dashboard */}
//           <Route element={<ProtectedRoute allowedRoles={["coach"]} />}>
//             <Route path="/coach-dashboard" element={<CoachDashboard />}>
//               <Route index element={<DashboardCoach />} />
//               <Route path="create-teams" element={<CreateTeams />} />
//               <Route path="create-events" element={<CreateEvents />} />
//               <Route path="view-users" element={<ViewUsers />} />
//               <Route path="messages" element={<CoachMessage />} />
//               <Route path="reports" element={<CoachReports />} />
//               <Route path="eventRegister" element={<CoachRegistrations />} />
//             </Route>
//           </Route>

//           {/* 🔴 Admin Dashboard */}
//           <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//             <Route path="/admin" element={<AdminPanel />}>
//               <Route index element={<Dashboard />} />
//               <Route path="user-management" element={<ManageUser />} />
//               <Route path="messages" element={<SendNotification />} />
//               <Route path="events" element={<CreateEvent />} />
//               <Route path="pending-event" element={<PendingEvents />} />
//               <Route path="pending-teams" element={<PendingTeams />} />
//               <Route path="sports-categories" element={<SportsCategories />} />
//               <Route path="reports" element={<AdminReports />} />
//               <Route path="profiles" element={<AdminProfiles />} />
//             </Route>
//           </Route>

//           {/* ❌ 404 and Unauthorized */}
//           <Route path="/unauthorized" element={<Unauthorized />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Suspense>
//       <Footer />
//       <ChatLauncher />
//     </>
//   );
// }

// // Main App component with providers
// function App() {
//   return (
//     <Provider store={store}>
//       <AuthProvider>
//         <Toaster 
//           richColors 
//           position="top-right"
//           toastOptions={{
//             style: {
//               background: 'white',
//               color: 'black',
//               border: '1px solid #e2e8f0',
//             },
//           }}
//         />
//         <Router>
//           <AppContent />
//         </Router>
//       </AuthProvider>
//     </Provider>
//   );
// }

// export default App;



import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store/store";
import axios from "axios";

// Layout
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner.jsx";

// Context - import both provider and hook
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Unauthorized from "./Pages/Unauthorized.jsx";

// Chat Components
import ChatLauncher from "./Components/Chat/ChatLauncher.jsx";
import UserMessage from "./Components/Chat/UserMessage.jsx";
import CoachMessage from "./Components/Chat/CoachMessage.jsx";
import SendNotification from "./Components/Chat/SendNotification.jsx";

// Shop Components
import Products from "./Components/Shop/Products.jsx";
import ProductDetails from "./Components/Shop/ProductDetails.jsx";
import Cart from "./Components/Shop/Cart.jsx";
import Checkout from "./Components/Shop/Checkout.jsx";
import Orders from "./Components/Shop/Orders.jsx";

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
const CreateEvent = lazy(() => import("./Components/AdminComponents/CreateEvent.jsx"));
const PendingEvents = lazy(() => import("./Components/AdminComponents/PendingEvents.jsx"));
const PendingTeams = lazy(() => import("./Components/AdminComponents/PendingTeams.jsx"));
const SportsCategories = lazy(() => import("./Components/AdminComponents/SportsCategories.jsx"));
const ManageUser = lazy(() => import("./Components/AdminComponents/ManageUser.jsx"));
const AdminReports = lazy(() => import("./Components/AdminComponents/Reports.jsx"));
const AdminProfiles = lazy(() => import("./Components/AdminComponents/AdminProfiles.jsx"));
const ManageProducts = lazy(() => import("./Components/AdminComponents/ManageProducts.jsx"));
const ManageOrders = lazy(() => import("./Components/AdminComponents/ManageOrders.jsx"));

// Coach Components
const DashboardCoach = lazy(() => import("./Components/CoachComponents/Dashboard.jsx"));
const CreateTeams = lazy(() => import("./Components/CoachComponents/CreateTeams.jsx"));
const CreateEvents = lazy(() => import("./Components/CoachComponents/CreateEvents.jsx"));
const ViewUsers = lazy(() => import("./Components/CoachComponents/ManageUser.jsx"));
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
const Feedback = lazy(() =>
  import("./Components/ParticipantComponents/Feedback.jsx")
);
const ViewProfile = lazy(() =>
  import("./Components/ViewProfile.jsx")
);
const EditProfile = lazy(() => import("./Components/EditProfile.jsx"));

// Create a separate component that uses the auth hook
function AppContent() {
  const { user, loading, token } = useAuth();

  // Set up axios interceptor for token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
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
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* 🛍️ Shop Routes - Public */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* 🛒 Shop Routes - Protected (All logged-in users) */}
          <Route element={<ProtectedRoute allowedRoles={["participant", "coach", "admin"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* 🔵 Participant Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
            <Route path="/dashboard" element={<ParticipantDashboard />}>
              <Route index element={<ParticipantHome />} />
              <Route path="register-event" element={<RegisterForEvent />} />
              <Route path="stats" element={<UserStatsDashboard />} />
              <Route path="join-team" element={<JoinTeam />} />
              <Route path="messages" element={<UserMessage />} />
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
              {/* New Admin Shop Management Routes */}
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
            </Route>
          </Route>

          {/* ❌ 404 and Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <ChatLauncher />
    </>
  );
}

// Main App component with providers
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Toaster 
          richColors 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e2e8f0',
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }}
        />
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;