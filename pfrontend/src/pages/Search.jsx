import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import Filters from '../components/Filters';
import { newsAPI } from '../services/api';
import { FaSearch, FaCalendar, FaFilter, FaDatabase } from 'react-icons/fa';

export default function Search() {
  const location = useLocation();
  const [searchInput, setSearchInput] = useState(location.state?.keyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Search on mount or when keyword changes
  useEffect(() => {
    if (location.state?.keyword) {
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
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search News</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Find news articles by entering any word, phrase, paragraph, or category below.
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleFormSubmit} className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Type any word, phrase, paragraph, or category..."
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 text-lg"
          disabled={loading}
        >
          <FaSearch className="text-xl" />
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={clearResults}
          className="px-4 py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
        >
          Clear
        </button>
      </form>

      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Searching...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div>
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-200 mb-2">Search Results</h3>
              <p className="text-green-700 dark:text-green-100 text-sm">
                Found {articles.length} articles matching your search.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <NewsCard
                  key={article.url || article.title}
                  article={article}
                  showStatus={true}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-8">
            <FaSearch className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Results Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try a different word, phrase, or category.
            </p>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {!loading && !error && articles.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Search Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-medium">Results:</span> {articles.length}
            </div>
            <div>
              <span className="font-medium">Keywords:</span> {searchInput || 'None'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
