import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaShare, FaThumbsUp, FaThumbsDown, FaEye, FaExternalLinkAlt, FaPlay, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { debugArticleImages, getEnhancedImageUrl, isLikelyCorsBlocked, getCorsProxyUrl, testImageWithFallback } from '../utils/imageUtils';
import ArticleSummary from './ArticleSummary';
import { useNavigate } from 'react-router-dom';

export default function NewsCard({ article, onLike, onBookmark, onShare, showStatus = true }) {
  const { isDarkMode } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const articleId = article.url || article.id;

  // Check if article has video content
  const hasVideo = article.urlToImage?.includes('video') || 
                   article.title?.toLowerCase().includes('video') ||
                   article.description?.toLowerCase().includes('video') ||
                   article.url?.includes('youtube') ||
                   article.url?.includes('vimeo');

  // Generate category based on article content
  const getCategory = () => {
    if (article.category) return article.category;
    if (article.title?.toLowerCase().includes('cybersecurity') || article.title?.toLowerCase().includes('security')) return 'cybersecurity';
    if (article.title?.toLowerCase().includes('technology') || article.title?.toLowerCase().includes('tech')) return 'technology';
    if (article.title?.toLowerCase().includes('business')) return 'business';
    if (article.title?.toLowerCase().includes('politics')) return 'politics';
    if (article.title?.toLowerCase().includes('science')) return 'science';
    if (article.title?.toLowerCase().includes('health')) return 'health';
    return 'general';
  };

  // Enhanced getImageUrl function
  const getImageUrl = () => {
    if (enhancedImageUrl) {
      return enhancedImageUrl;
    }
    
    if (article.urlToImage && article.urlToImage !== 'null' && article.urlToImage !== '') {
      return article.urlToImage;
    }
    if (article.image && article.image !== 'null' && article.image !== '') {
      return article.image;
    }
    if (article.urlToImage && typeof article.urlToImage === 'string' && article.urlToImage.length > 0) {
      return article.urlToImage;
    }
    
    const category = getCategory();
    const articleId = article.url || article.id || article._id;
    return `https://picsum.photos/400/250?random=${articleId || Date.now() + Math.random()}`;
  };

  // Get enhanced image URL
  useEffect(() => {
    const loadEnhancedImage = async () => {
      const url = await getEnhancedImageUrl(article);
      setEnhancedImageUrl(url);
    };
    loadEnhancedImage();
  }, [article]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error with better fallback
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageError(true);
    setImageLoading(false);
    if (!e.target.src.includes('/proxy/image?url=') && (isLikelyCorsBlocked(e.target.src) || e.type === 'error')) {
      const backendProxy = `http://127.0.0.1:8000/proxy/image?url=${encodeURIComponent(e.target.src)}`;
      console.log('Trying backend image proxy:', backendProxy);
      e.target.src = backendProxy;
      return;
    }
    const articleId = article.url || article.id || article._id;
    const fallbackUrl = `https://picsum.photos/400/250?random=${articleId || Date.now() + Math.random()}`;
    if (e.target.src !== fallbackUrl) {
      e.target.src = fallbackUrl;
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark articles');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await userAPI.unbookmarkArticle(articleId);
        setIsBookmarked(false);
      } else {
        await userAPI.bookmarkArticle(articleId, article);
        setIsBookmarked(true);
      }
      if (onBookmark) onBookmark(article);
    } catch (error) {
      console.error('Failed to bookmark article:', error);
      alert('Failed to bookmark article');
    } finally {
      setLoading(false);
    }
  };

  // Handle article click (mark as read and show summary)
  const handleArticleClick = async () => {
    if (isAuthenticated && !isRead) {
      try {
        await userAPI.addToHistory(articleId);
        setIsRead(true);
      } catch (error) {
        console.error('Failed to add to reading history:', error);
      }
    }
    
    setShowSummary(true);
  };

  // Handle read original article
  const handleReadOriginal = () => {
    window.open(article.url, '_blank');
  };

  // Handle read full article click
  const handleReadFullArticle = () => {
    navigate(`/article/${encodeURIComponent(article.url || article.id)}`, { state: { article } });
  };

  const category = getCategory();
  const imageUrl = getImageUrl();

  // Get category color
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'cybersecurity': return 'bg-red-500';
      case 'technology': return 'bg-blue-500';
      case 'business': return 'bg-green-500';
      case 'politics': return 'bg-purple-500';
      case 'science': return 'bg-yellow-500';
      case 'health': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <motion.div 
        className={`news-card-enhanced rounded-lg overflow-hidden theme-transition-medium border hover-lift-enhanced ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ y: -12, scale: 1.03 }}
      >
        {/* Article Image */}
        <div className="relative">
          {imageUrl && !imageError ? (
            <div className="relative">
              {imageLoading && (
                <div className={`absolute inset-0 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
              <img
                src={imageUrl}
                alt={article.title} 
                className={`w-full h-48 object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
              />
              {/* Video Play Button Overlay */}
              {hasVideo && !imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <motion.div 
                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay className="text-white text-lg ml-1" />
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full h-48 flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaEye className={`text-4xl mx-auto mb-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </motion.div>
                <p className={`text-sm capitalize ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{category}</p>
              </div>
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <motion.span 
              className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(category)}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {category}
            </motion.span>
          </div>
          
          {/* Bookmark Button */}
          <motion.button
            onClick={handleBookmark}
            className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all ${
              isDarkMode 
                ? 'bg-black/50 hover:bg-black/70' 
                : 'bg-white/80 hover:bg-white/90'
            }`}
            whileTap={{ scale: 1.4, rotate: 25 }}
            whileHover={{ scale: 1.15 }}
            aria-label="Bookmark"
            disabled={loading}
          >
            <AnimatePresence initial={false} mode="wait">
              {isBookmarked ? (
                <motion.span
                  key="bookmarked"
                  initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <FaBookmark className="text-teal-400 text-sm icon-sleek" />
                </motion.span>
              ) : (
                <motion.span
                  key="not-bookmarked"
                  initial={{ scale: 0.5, rotate: 45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.5, rotate: -45, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <FaBookmark className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } icon-sleek`} />
                </motion.span>
              )}
            </AnimatePresence>
            {loading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="w-3 h-3 border border-teal-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Article Content */}
        <div className="p-4 card-content theme-transition-fast">
          {/* Source and Date */}
          <div className="flex items-center justify-between mb-3">
            <motion.span 
              className="text-teal-400 text-sm font-medium text-glow gradient-text"
              whileHover={{ scale: 1.08 }}
            >
              {article.source?.name || article.source || 'News Source'}
            </motion.span>
            <div className={`flex items-center gap-2 text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <FaClock className="text-xs icon-sleek" />
              </motion.div>
              <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
          </div>

          {/* AI Summary Badge */}
          <div className="flex items-center gap-2 mb-3">
            <motion.span 
              className="text-yellow-400 text-sm"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ⚡
            </motion.span>
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>AI Summary</span>
          </div>

          {/* Title */}
          <motion.h3 
            className={`font-bold text-lg mb-3 line-clamp-2 cursor-pointer theme-transition-fast leading-tight ${
              isDarkMode 
                ? 'text-white hover:text-teal-400' 
                : 'text-gray-900 hover:text-teal-600'
            }`}
            whileHover={{ scale: 1.03, x: 5 }}
            onClick={handleReadFullArticle}
          >
            {article.title}
          </motion.h3>

          {/* Description */}
          <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {article.description || article.summary || 'No description available'}
          </p>

          {/* Meta and Actions */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="font-medium">4 min read</span>
            </div>
            <motion.button
              onClick={handleReadFullArticle}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium theme-transition-fast btn-sleek ${
                isDarkMode 
                  ? 'text-teal-400 hover:text-teal-300' 
                  : 'text-teal-600 hover:text-teal-700'
              }`}
              whileHover={{ scale: 1.08, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              Read full article
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaExternalLinkAlt className="text-xs icon-sleek" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Article Summary Modal */}
      {/* Remove modal opening for summary, as we now use a dedicated page */}
    </>
  );
}