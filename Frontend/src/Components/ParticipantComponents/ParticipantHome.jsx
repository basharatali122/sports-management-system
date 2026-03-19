// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ThemeContext } from "../../context/ThemeContext";
// import { useAuth } from "../../context/AuthContext";
// import useUser from "../../context/UserContext";
// import {
//   CalendarDays,
//   Users,
//   User,
//   BarChart3,
//   Trophy,
//   Bell,
//   Clock,
// } from "lucide-react";
// import { motion, useAnimation } from "framer-motion";

// const quickActions = [
//   {
//     title: "Register for Events",
//     icon: CalendarDays,
//     path: "/dashboard/register-event",
//     color: "text-blue-500",
//   },
//   {
//     title: "Join a Team",
//     icon: Users,
//     path: "/dashboard/join-team",
//     color: "text-green-500",
//   },
//   {
//     title: "My Profile",
//     icon: User,
//     path: "/dashboard/view-profile",
//     color: "text-purple-500",
//   },
//   {
//     title: "Performance",
//     icon: BarChart3,
//     path: "/dashboard/stats",
//     color: "text-yellow-500",
//   },
// ];

// export default function ParticipantHome() {
//   const { themeMode } = useContext(ThemeContext);
//   const isDark = themeMode === "dark";
//   const { user } = useUser();

//   const [stats, setStats] = useState({
//     totalEvents: 0,
//     totalTeams: 0,
//     notifications: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const controls = useAnimation();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [eventsRes, teamsRes] = await Promise.all([
//           fetch("http://localhost:3000/events/getParticipantEvents"),
//           fetch("http://localhost:3000/team/approved-teams"),
//         ]);
//         console.log("Events Response:", eventsRes); 

//         const events = await eventsRes.json();
//         const teams = await teamsRes.json();

//         setStats({
//           totalEvents: events?.length || 0,
//           totalTeams: teams?.length || 0,
//           notifications: Math.floor(Math.random() * 10) + 1, 
//         });

//         controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [controls]);

//   const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
//   const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
//   const cardBg = isDark
//     ? "bg-gray-900/80 border-gray-800"
//     : "bg-white/90 border-gray-200";
//   const hoverShadow = isDark
//     ? "hover:shadow-xl hover:shadow-gray-800/40"
//     : "hover:shadow-xl hover:shadow-gray-200";

//   const AnimatedNumber = ({ value, duration = 1.2 }) => {
//     const [count, setCount] = useState(0);
//     useEffect(() => {
//       let start = 0;
//       const increment = value / (duration * 60);
//       const interval = setInterval(() => {
//         start += increment;
//         if (start >= value) {
//           start = value;
//           clearInterval(interval);
//         }
//         setCount(Math.floor(start));
//       }, 16);
//       return () => clearInterval(interval);
//     }, [value, duration]);
//     return <span>{count}</span>;
//   };

//   return (
//     <div className={`max-w-7xl mx-auto space-y-10 p-6 md:p-10`}>
//       {/* Header */}
//       <motion.header
//         className="mb-8"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         <h1 className={`text-3xl font-bold flex items-center gap-3 ${textPrimary}`}>
//           <Trophy
//             size={30}
//             className={isDark ? "text-yellow-400" : "text-yellow-600"}
//           />
//           Welcome, {user?.name || "Participant"} 
//         </h1>
//         <p className={`mt-2 text-lg ${textSecondary}`}>
//           Here's a quick overview of your activity and opportunities.
//         </p>
//       </motion.header>

//       {/* Quick Actions */}
//       <motion.section
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.1, duration: 0.4 }}
//       >
//         {quickActions.map(({ title, icon: Icon, path, color }) => (
//           <Link key={title} to={path}>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//               className={`flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 ${cardBg} ${hoverShadow}`}
//             >
//               <Icon size={40} className={`${color} mb-3`} />
//               <h3 className={`text-lg font-semibold text-center ${textPrimary}`}>
//                 {title}
//               </h3>
//             </motion.div>
//           </Link>
//         ))}
//       </motion.section>

//       {/* Summary Section */}
//       <motion.section
//         className={`rounded-2xl border p-6 transition-all ${cardBg}`}
//         initial={{ opacity: 0, y: 20 }}
//         animate={controls}
//       >
//         <h2 className={`text-xl font-semibold mb-6 ${textPrimary}`}>
//           Your Summary
//         </h2>

//         {loading ? (
//           <p className={`text-center text-sm ${textSecondary}`}>Loading your data...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             <motion.div
//               whileHover={{ y: -4 }}
//               className="flex flex-col items-center justify-center p-5 rounded-xl bg-blue-100/40 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
//             >
//               <Clock size={32} className="mb-2" />
//               <h3 className="text-2xl font-bold">
//                 <AnimatedNumber value={stats.totalEvents} />
//               </h3>
//               <p>Total Events</p>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -4 }}
//               className="flex flex-col items-center justify-center p-5 rounded-xl bg-green-100/40 dark:bg-green-900/40 text-green-800 dark:text-green-200"
//             >
//               <Users size={32} className="mb-2" />
//               <h3 className="text-2xl font-bold">
//                 <AnimatedNumber value={stats.totalTeams} />
//               </h3>
//               <p>Teams Available</p>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -4 }}
//               className="flex flex-col items-center justify-center p-5 rounded-xl bg-yellow-100/40 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
//             >
//               <Bell size={32} className="mb-2" />
//               <h3 className="text-2xl font-bold">
//                 <AnimatedNumber value={stats.notifications} />
//               </h3>
//               <p>New Notifications</p>
//             </motion.div>
//           </div>
//         )}
//       </motion.section>

//       {/* Font Import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
//         * {
//           font-family: 'Poppins', sans-serif !important;
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useUser from "../../context/UserContext";
import {
  CalendarDays,
  Users,
  User,
  BarChart3,
  Trophy,
  Bell,
  Clock,
  ShoppingBag,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";

const quickActions = [
  {
    title: "Register for Events",
    icon: CalendarDays,
    path: "/dashboard/register-event",
    color: "text-blue-500",
    description: "Join upcoming sports events",
  },
  {
    title: "Join a Team",
    icon: Users,
    path: "/dashboard/join-team",
    color: "text-green-500",
    description: "Find and join teams",
  },
  {
    title: "My Profile",
    icon: User,
    path: "/dashboard/view-profile",
    color: "text-purple-500",
    description: "View and edit your profile",
  },
  {
    title: "Performance",
    icon: BarChart3,
    path: "/dashboard/stats",
    color: "text-yellow-500",
    description: "Track your progress",
  },
];

// 🆕 New eCommerce Actions
const shopActions = [
  {
    title: "Browse Products",
    icon: ShoppingBag,
    path: "/products",
    color: "text-indigo-500",
    description: "Shop for sports kits and equipment",
  },
  {
    title: "My Orders",
    icon: Package,
    path: "/orders",
    color: "text-orange-500",
    description: "Track your orders",
  },
  {
    title: "Shopping Cart",
    icon: ShoppingCart,
    path: "/cart",
    color: "text-pink-500",
    description: "View and manage your cart",
  },
  {
    title: "Rate Products",
    icon: Star,
    path: "/orders",
    color: "text-amber-500",
    description: "Review purchased items",
  },
];

export default function ParticipantHome() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";
  const { user } = useUser();

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTeams: 0,
    notifications: 0,
    totalOrders: 0,
    cartItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, teamsRes, ordersRes, cartRes] = await Promise.all([
          fetch("http://localhost:3000/events/getParticipantEvents"),
          fetch("http://localhost:3000/team/approved-teams"),
          fetch("http://localhost:3000/orders/my", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch("http://localhost:3000/cart", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        const events = await eventsRes.json();
        const teams = await teamsRes.json();
        const orders = await ordersRes.json();
        const cart = await cartRes.json();

        setStats({
          totalEvents: events?.length || 0,
          totalTeams: teams?.length || 0,
          notifications: Math.floor(Math.random() * 10) + 1,
          totalOrders: orders?.data?.orders?.length || 0,
          cartItems: cart?.data?.itemCount || 0,
        });

        controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [controls]);

  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark
    ? "bg-gray-900/80 border-gray-800"
    : "bg-white/90 border-gray-200";
  const hoverShadow = isDark
    ? "hover:shadow-xl hover:shadow-gray-800/40"
    : "hover:shadow-xl hover:shadow-gray-200";

  const AnimatedNumber = ({ value, duration = 1.2 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const increment = value / (duration * 60);
      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          start = value;
          clearInterval(interval);
        }
        setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(interval);
    }, [value, duration]);
    return <span>{count}</span>;
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-10 p-6 md:p-10`}>
      {/* Header */}
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={`text-3xl font-bold flex items-center gap-3 ${textPrimary}`}>
          <Trophy
            size={30}
            className={isDark ? "text-yellow-400" : "text-yellow-600"}
          />
          Welcome, {user?.name || "Participant"}! 
          {stats.cartItems > 0 && (
            <span className="ml-2 px-2 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
              🛒 {stats.cartItems} in cart
            </span>
          )}
        </h1>
        <p className={`mt-2 text-lg ${textSecondary}`}>
          Here's a quick overview of your activity, opportunities, and shopping.
        </p>
      </motion.header>

      {/* Quick Actions - Main */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className={`text-xl font-semibold ${textPrimary}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map(({ title, icon: Icon, path, color, description }) => (
            <Link key={title} to={path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 ${cardBg} ${hoverShadow}`}
              >
                <Icon size={40} className={`${color} mb-3`} />
                <h3 className={`text-lg font-semibold text-center ${textPrimary}`}>
                  {title}
                </h3>
                <p className={`text-xs text-center mt-1 ${textSecondary}`}>
                  {description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 🆕 Shop Actions */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className={`text-xl font-semibold ${textPrimary}`}>Sports Shop</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {shopActions.map(({ title, icon: Icon, path, color, description }) => (
            <Link key={title} to={path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 ${cardBg} ${hoverShadow}`}
              >
                <Icon size={40} className={`${color} mb-3`} />
                <h3 className={`text-lg font-semibold text-center ${textPrimary}`}>
                  {title}
                </h3>
                <p className={`text-xs text-center mt-1 ${textSecondary}`}>
                  {description}
                </p>
                {title === "Shopping Cart" && stats.cartItems > 0 && (
                  <span className="mt-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    {stats.cartItems} items
                  </span>
                )}
                {title === "My Orders" && stats.totalOrders > 0 && (
                  <span className="mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {stats.totalOrders} orders
                  </span>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Summary Section */}
      <motion.section
        className={`rounded-2xl border p-6 transition-all ${cardBg}`}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <h2 className={`text-xl font-semibold mb-6 ${textPrimary}`}>
          Your Summary
        </h2>

        {loading ? (
          <p className={`text-center text-sm ${textSecondary}`}>Loading your data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-100/40 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
            >
              <Clock size={28} className="mb-2" />
              <h3 className="text-xl font-bold">
                <AnimatedNumber value={stats.totalEvents} />
              </h3>
              <p className="text-sm">Total Events</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-100/40 dark:bg-green-900/40 text-green-800 dark:text-green-200"
            >
              <Users size={28} className="mb-2" />
              <h3 className="text-xl font-bold">
                <AnimatedNumber value={stats.totalTeams} />
              </h3>
              <p className="text-sm">Teams Available</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-yellow-100/40 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
            >
              <Bell size={28} className="mb-2" />
              <h3 className="text-xl font-bold">
                <AnimatedNumber value={stats.notifications} />
              </h3>
              <p className="text-sm">Notifications</p>
            </motion.div>

            {/* 🆕 New Stats Cards */}
            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-100/40 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
            >
              <Package size={28} className="mb-2" />
              <h3 className="text-xl font-bold">
                <AnimatedNumber value={stats.totalOrders} />
              </h3>
              <p className="text-sm">Total Orders</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-pink-100/40 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200"
            >
              <ShoppingCart size={28} className="mb-2" />
              <h3 className="text-xl font-bold">
                <AnimatedNumber value={stats.cartItems} />
              </h3>
              <p className="text-sm">Cart Items</p>
            </motion.div>
          </div>
        )}
      </motion.section>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
}