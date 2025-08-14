import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '../components/NewsCard';
import Filters from '../components/Filters';
import { newsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaCalendar, FaFilter, FaDatabase } from 'react-icons/fa';

export default function Search() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState(location.state?.keyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Search on mount or when keyword changes
  useEffect(() => {
    if (location.state?.category) {
      handleSearchByCategory(location.state.category);
    } else if (location.state?.keyword) {
      setSearchInput(location.state.keyword);
      handleSearch(location.state.keyword);
    }
  }, [location.state]);

  // Main search handler
  const handleSearch = async (input) => {
    if (!input || !input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.searchNews({ keywords: input });
      setArticles(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.searchNews({ category });
      setArticles(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const clearResults = () => {
    setArticles([]);
    setError(null);
    setSearchInput('');
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Search News</h1>
        <p className={`${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Find news articles by entering any word, phrase, paragraph, or category below.
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.form 
        onSubmit={handleFormSubmit} 
        className="mb-8 flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Type any word, phrase, paragraph, or category..."
          className={`flex-1 px-4 py-3 border rounded-lg text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 focus-enhanced ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="submit"
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 text-lg btn-hover"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <FaSearch className="text-xl" />
          </motion.div>
          {loading ? 'Searching...' : 'Search'}
        </motion.button>
        <motion.button
          type="button"
          onClick={clearResults}
          className={`px-4 py-3 text-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear
        </motion.button>
      </motion.form>

      {/* Results */}
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
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-200 mx-auto"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <motion.p 
                className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Searching...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              className={`border rounded-lg p-4 mb-4 ${
                isDarkMode 
                  ? 'bg-red-900/20 border-red-800' 
                  : 'bg-red-50 border-red-200'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <p className={`${
                isDarkMode ? 'text-red-200' : 'text-red-700'
              }`}>Error: {error}</p>
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
                    ? 'bg-green-900/20 border-green-800' 
                    : 'bg-green-50 border-green-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-green-200' : 'text-green-700'
                }`}>Search Results</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-green-100' : 'text-green-700'
                }`}>
                Found {articles.length} articles matching your search.
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

        <AnimatePresence>
          {!loading && !error && articles.length === 0 && searchInput && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaSearch className={`text-4xl mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
              </motion.div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>No Results Found</h3>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Try a different word, phrase, or category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Stats */}
      {!loading && !error && articles.length > 0 && (
        <motion.div 
          className={`mt-8 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Search Summary</h3>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div>
              <span className="font-medium">Results:</span> {articles.length}
            </div>
            <div>
              <span className="font-medium">Keywords:</span> {searchInput || 'None'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
