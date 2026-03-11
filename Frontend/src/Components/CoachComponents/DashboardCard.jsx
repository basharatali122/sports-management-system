import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function DashboardCard({ title, icon, sub = [], type }) {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === 'dark';

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const hoverShadow = isDark ? 'hover:shadow-xl' : 'hover:shadow-lg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${cardBg} ${textPrimary} rounded-2xl shadow p-6 flex flex-col justify-between transition-shadow ${hoverShadow}`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      {sub.length > 0 && (
        <ul className={`mt-4 ${textSecondary} text-sm list-disc list-inside`}>
          {sub.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
