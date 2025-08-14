import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaBookmark, FaShare, FaGlobe, FaExternalLinkAlt, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  // Use article from location.state if available, otherwise fallback (could fetch by id here)
  const article = location.state?.article || {};

  const handleLike = () => {
    setLiked((v) => !v);
    if (!liked && disliked) setDisliked(false);
  };
  const handleDislike = () => {
    setDisliked((v) => !v);
    if (!disliked && liked) setLiked(false);
  };
  const handleShare = async () => {
    setShared(true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.description,
          url: article.url
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Link copied to clipboard!');
    }
  };
  const handleReadOriginal = () => window.open(article.url, '_blank');

  // Get image
  const imageUrl = article.urlToImage || article.image || '';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-custom-gray hover:text-teal-400 mb-6 text-base font-medium"
      >
        <FaArrowLeft /> Back to News
      </button>

      {/* Article Image */}
      {imageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img src={imageUrl} alt={article.title} className="w-full h-72 object-cover" />
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-[#192132] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400 text-lg">⚡</span>
          <h3 className="text-white font-bold text-lg">AI Summary</h3>
        </div>
        <div className={`text-custom-gray text-base leading-relaxed ${showFullSummary ? '' : 'line-clamp-4'}`}>
          {article.summary || article.description || 'No summary available.'}
        </div>
        {((article.summary && article.summary.length > 200) || (article.description && article.description.length > 200)) && (
          <button
            className="mt-2 text-teal-400 hover:underline text-sm font-medium focus:outline-none"
            onClick={() => setShowFullSummary((v) => !v)}
          >
            {showFullSummary ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={handleReadOriginal}
          className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-base"
        >
          <FaGlobe /> <FaExternalLinkAlt /> Read Original Article
        </button>
        <motion.button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${liked ? 'bg-teal-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
          whileTap={{ scale: 1.2, rotate: 10 }}
          whileHover={{ scale: 1.08 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {liked ? (
              <motion.span
                key="liked"
                initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <FaThumbsUp />
              </motion.span>
            ) : (
              <motion.span
                key="not-liked"
                initial={{ scale: 0.7, rotate: 30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <FaThumbsUp />
              </motion.span>
            )}
          </AnimatePresence>
          Like
        </motion.button>
        <motion.button
          onClick={handleDislike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${disliked ? 'bg-pink-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
          whileTap={{ scale: 1.2, rotate: -10 }}
          whileHover={{ scale: 1.08 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {disliked ? (
              <motion.span
                key="disliked"
                initial={{ scale: 0.7, rotate: 30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <FaThumbsDown />
              </motion.span>
            ) : (
              <motion.span
                key="not-disliked"
                initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <FaThumbsDown />
              </motion.span>
            )}
          </AnimatePresence>
          Dislike
        </motion.button>
        <motion.button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${shared ? 'bg-cyan-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
          whileTap={{ scale: 1.2, rotate: 5 }}
          whileHover={{ scale: 1.08 }}
        >
          <FaShare /> Share
        </motion.button>
      </div>
    </div>
  );
} 