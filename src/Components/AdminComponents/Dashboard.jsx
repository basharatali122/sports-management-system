import { Link, Outlet } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { motion } from "framer-motion";

// Lucide icons
import {
  Users,
  UserCheck,
  CalendarDays,
  Trophy,
  FileBarChart,
  ClipboardList,
} from "lucide-react";

const cards = [
  {
    title: "Manage Participants",
    icon: <Users className="w-6 h-6 text-emerald-500" />,
    path: "/admin/user-management",
  },
  {
    title: "Approve Teams",
    icon: <UserCheck className="w-6 h-6 text-blue-500" />,
    path: "/admin/pending-teams",
  },
  {
    title: "Approve Events",
    icon: <ClipboardList className="w-6 h-6 text-indigo-500" />,
    path: "/admin/pending-event",
  },
  {
    title: "Schedule Events",
    icon: <CalendarDays className="w-6 h-6 text-teal-500" />,
    path: "/admin/events",
  },
  {
    title: "Manage Sports Categories",
    icon: <Trophy className="w-6 h-6 text-amber-500" />,
    path: "/admin/sports-categories",
  },
  {
    title: "Reports",
    icon: <FileBarChart className="w-6 h-6 text-rose-500" />,
    path: "/admin/reports",
  },
];

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-10 font-[Poppins]"
    >
      {cards.map((card, i) => (
        <Link to={card.path} key={i}>
          <DashboardCard {...card} />
        </Link>
      ))}

      <Outlet />

      {/* Import Poppins font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </motion.div>
  );
}


// import { Link, Outlet } from "react-router-dom";
// import DashboardCard from "./DashboardCard";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [metrics, setMetrics] = useState({
//     participants: 0,
//     teams: 0,
//     events: 0,
//     categories: 0,
//     reports: [12, 19, 8, 15, 22, 30],
//   });

//   // Simulated API fetch
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       // Simulate loading dynamic data
//       setTimeout(() => {
//         setMetrics({
//           participants: 523,
//           teams: 41,
//           events: 17,
//           categories: 9,
//           reports: [10, 14, 20, 18, 22, 29],
//         });
//       }, 800);
//     };
//     fetchDashboardData();
//   }, []);

//   const cards = [
//     {
//       title: "Manage Participants",
//       icon: "🧑‍🤝‍🧑",
//       path: "/admin/user-management",
//       value: metrics.participants,
//     },
//     {
//       title: "Approve Teams",
//       icon: "✅",
//       path: "/admin/pending-teams",
//       value: metrics.teams,
//     },
//     {
//       title: "Approve Events",
//       icon: "✅",
//       path: "/admin/pending-event",
//       value: metrics.events,
//     },
//     {
//       title: "Schedule Events",
//       icon: "🗓️",
//       path: "/admin/events",
//     },
//     {
//       title: "Manage Sports Categories",
//       icon: "🏆",
//       path: "/admin/sports-categories",
//       value: metrics.categories,
//     },
//     {
//       title: "Reports",
//       icon: "📊",
//       path: "/admin/reports",
//       type: "chart",
//       chartData: metrics.reports,
//     },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-10 font-[Poppins]"
//     >
//       {cards.map((card, i) => (
//         <Link to={card.path} key={i}>
//           <DashboardCard {...card} />
//         </Link>
//       ))}
//       <Outlet />

//       {/* Poppins Font Import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
//         * {
//           font-family: 'Poppins', sans-serif !important;
//         }
//       `}</style>
//     </motion.div>
//   );
// }
