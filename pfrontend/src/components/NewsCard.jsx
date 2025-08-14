import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaShare, FaThumbsUp, FaThumbsDown, FaEye, FaExternalLinkAlt, FaPlay, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { debugArticleImages, getEnhancedImageUrl, isLikelyCorsBlocked, getCorsProxyUrl, testImageWithFallback } from '../utils/imageUtils';
import ArticleSummary from './ArticleSummary';
import { useNavigate } from 'react-router-dom';

export default function NewsCard({ article, onLike, onBookmark, onShare, showStatus = true }) {
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
      <div className=" rounded-lg overflow-hidden hover:bg-slate-750 transition-all duration-300 border border-slate-700 hover:border-slate-600" style={{ backgroundColor: '#1F2937' }}>
        {/* Article Image */}
        <div className="relative">
          {imageUrl && !imageError ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt={article.title} 
                className="w-full h-48 object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
              />
              {imageLoading && (
                <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              )}
              {/* Video Play Button Overlay */}
              {hasVideo && !imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <FaPlay className="text-white text-lg ml-1" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-700 flex items-center justify-center">
              <div className="text-center">
                <FaEye className="text-gray-500 text-4xl mx-auto mb-2" />
                <p className="text-gray-400 text-sm capitalize">{category}</p>
              </div>
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
          
          {/* Bookmark Button */}
          <motion.button
            onClick={handleBookmark}
            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
            whileTap={{ scale: 1.3, rotate: 20 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Bookmark"
          >
            <AnimatePresence initial={false} mode="wait">
              {isBookmarked ? (
                <motion.span
                  key="bookmarked"
                  initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.7, rotate: 30, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <FaBookmark className="text-teal-400 text-sm" />
                </motion.span>
              ) : (
                <motion.span
                  key="not-bookmarked"
                  initial={{ scale: 0.7, rotate: 30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.7, rotate: -30, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <FaBookmark className="text-gray-400 text-sm" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Article Content */}
        <div className="p-4">
          {/* Source and Date */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-teal-400 text-sm font-medium">
              {article.source?.name || article.source || 'News Source'}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <FaClock className="text-xs" />
              <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
          </div>

          {/* AI Summary Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-400 text-sm">⚡</span>
            <span className="text-gray-400 text-xs font-medium">AI Summary</span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 cursor-pointer hover:text-teal-400 transition-colors leading-tight">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {article.description || article.summary || 'No description available'}
          </p>

          {/* Meta and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <span className="font-medium">4 min read</span>
            </div>
            <button
              onClick={handleReadFullArticle}
              className="flex items-center gap-2 px-3 py-1 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium"
            >
              Read full article
              <FaExternalLinkAlt className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Summary Modal */}
      {/* Remove modal opening for summary, as we now use a dedicated page */}
    </>
  );
}