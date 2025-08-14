import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaCog, FaFilter } from 'react-icons/fa';

export default function Personalized() {
  const { isDarkMode } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadPersonalizedNews();
    }
  }, [isAuthenticated]);

  const loadPersonalizedNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.getPersonalized('all');
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`p-4 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <motion.div 
          className={`border rounded-lg p-6 text-center ${
            isDarkMode 
              ? 'bg-yellow-900/20 border-yellow-800' 
              : 'bg-yellow-50 border-yellow-200'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaUser className={`text-3xl mx-auto mb-4 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
          </motion.div>
          <h2 className="text-xl font-semibold text-yellow-200 mb-2">Login Required</h2>
          <p className="text-yellow-100 mb-4">
            Please login to view your personalized news feed based on your preferences and reading history.
          </p>
          <motion.a 
            href="/login" 
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors btn-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Login
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Personalized News</h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              News tailored to your preferences and reading history
            </p>
          </div>
          <motion.a 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors btn-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCog className="text-sm" />
            Manage Preferences
          </motion.a>
        </div>
      </motion.div>

      {/* Content */}
      <div>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative mb-4">
                <motion.div
                  className="loading-spinner mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.p 
                className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading personalized news...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            className={`border rounded-lg p-4 mb-4 ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className={`${
              isDarkMode ? 'text-red-200' : 'text-red-700'
            }`}>Error: {error}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {!loading && !error && articles.length === 0 && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={`rounded-lg p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaUser className={`text-4xl mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </motion.div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>No Personalized News</h3>
                <p className={`mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                We couldn't find personalized news for you. This might be because:
                </p>
                <ul className={`text-left space-y-1 mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                <li>• You haven't set any preferences yet</li>
                <li>• You haven't liked or bookmarked any articles</li>
                <li>• Your reading history is empty</li>
                </ul>
                <motion.a 
                href="/profile" 
                  className="inline-block px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors btn-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                Set Your Preferences
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading && !error && articles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div 
                className={`mb-4 p-4 border rounded-lg ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-800' 
                    : 'bg-blue-50 border-blue-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>Your Personalized Feed</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-100' : 'text-blue-700'
                }`}>
                Showing {articles.length} articles based on your preferences, reading history, and engagement.
                </p>
              </motion.div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.url || article.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NewsCard
                      article={article}
                      showStatus={true}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      {!loading && !error && articles.length > 0 && (
        <motion.div 
          className={`mt-8 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Personalization Summary</h3>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div>
              <span className="font-medium">Total Articles:</span> {articles.length}
            </div>
            <div>
              <span className="font-medium">Source:</span> {'All'}
            </div>
            <div>
              <span className="font-medium">Recommended:</span> {
                articles.filter(a => a.status === 'Recommended').length
              }
            </div>
            <div>
              <span className="font-medium">Read:</span> {
                articles.filter(a => a.status === 'Read').length
              }
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
