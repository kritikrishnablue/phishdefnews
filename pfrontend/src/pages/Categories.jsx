import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Shield, Heart, Laptop,Home,Landmark,Trophy,Microscope,Building, Globe, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaFire } from 'react-icons/fa'; 

export default function Categories() {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    // Simulate loading categories
    setTimeout(() => {
      setCategories([
        {
          id: 'all',
          title: 'All News',
          description: 'Latest news from all categories, curated by AI for comprehensive coverage.',
          icon: Home,
          articleCount: 1247,
          trending: false,
          color: 'bg-gray-500'
        },
        {
          id: 'cybersecurity',
          title: 'Cybersecurity',
          description: 'Latest threats, security breaches, and defense strategies in the digital world.',
          icon: Shield,
          articleCount: 342,
          trending: true,
          color: 'bg-red-500'
        },
        {
          id: 'technology',
          title: 'Technology',
          description: 'Innovation, startups, and breakthrough technologies shaping our future.',
          icon: Laptop,
          articleCount: 567,
          trending: true,
          color: 'bg-blue-500'
        },
       {
          id: 'business',
          title: 'Business',
          description: 'Market trends, corporate news, and economic developments worldwide.',
          icon: Building,
          articleCount: 423,
          trending: false,
          color: 'bg-green-500'
        },
        {
          id: 'politics',
          title: 'Politics',
          description: 'Political developments, policy changes, and government affairs.',
          icon: Landmark,
          articleCount: 189,
          trending: false,
          color: 'bg-purple-500'
        },
        {
          id: 'science',
          title: 'Science',
          description: 'Scientific discoveries, research breakthroughs, and academic insights.',
          icon: Microscope,
          articleCount: 156,
          trending: false,
          color: 'bg-yellow-500'
        },
        {
          id: 'health',
          title: 'Health',
          description: 'Medical advances, health tips, and wellness trends for better living.',
          icon: Heart,
          articleCount: 234,
          trending: true,
          color: 'bg-pink-500'
        },
        {
          id: 'world',
          title: 'World',
          description: 'whats happening on earth',
          icon: Globe,
          articleCount: 178,
          trending: false,
          color: 'bg-indigo-400'
        },
        {
          id: 'sports',
          title: 'Sports',
          description: 'Athletic events, team updates, and sports industry news.',
          icon: Trophy,
          articleCount: 298,
          trending: false,
          color: 'bg-orange-500'
        },
       
       
        {
          id: 'travel',
          title: 'Travel',
          description: 'Travel industry updates, destination guides, and tourism trends.',
          icon: Plane,
          articleCount: 178,
          trending: false,
          color: 'bg-teal-500'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCategoryClick = (categoryId) => {
    // Navigate to search page with category filter
    navigate('/search', { 
      state: { 
        category: categoryId,
        source: 'all'
      }
    });
  };

  const trendingCategories = categories.filter(cat => cat.trending);
  const allCategories = categories;


  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-screen theme-transition-medium page-transition ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className={`text-3xl font-bold mb-2 gradient-text ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Categories</h1>
        <p className={`${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Explore news by category and discover trending topics
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto loading-enhanced"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Loading categories...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Trending Categories */}
            <div className="mb-8">
              <motion.div 
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaFire className="text-orange-500 text-lg icon-sleek" />
                </motion.div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Trending Categories</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.08,
                      ease: "easeOut"
                    }}
                  >
                    <CategoryCard 
                      category={category} 
                      onClick={() => handleCategoryClick(category.id)}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Categories */}
            <div>
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>All Categories</h2>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{allCategories.length} categories available</span>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {allCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: (index + trendingCategories.length) * 0.04,
                      ease: "easeOut"
                    }}
                  >
                    <CategoryCard 
                      category={category} 
                      onClick={() => handleCategoryClick(category.id)}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryCard({ category, onClick, isDarkMode }) {
  const IconComponent = category.icon;
  
  return (
    <motion.div 
      className={`rounded-lg p-6 cursor-pointer border theme-transition-fast hover-lift-enhanced ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600' 
          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="icon-sleek"
          >
            <IconComponent className="text-white text-xl" />
          </motion.div>
        </div>
        {category.trending && (
          <motion.div 
            className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaFire className="text-xs icon-sleek" />
            Trending
          </motion.div>
        )}
      </div>
      
      <h3 className={`font-bold text-lg mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>{category.title}</h3>
      <p className={`text-sm mb-4 line-clamp-2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {category.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}>{category.articleCount} articles</span>
        <motion.button 
          className={`flex items-center gap-1 font-medium theme-transition-fast ${
            isDarkMode 
              ? 'text-green-400 hover:text-green-300' 
              : 'text-green-600 hover:text-green-700'
          }`}
          whileHover={{ x: 8, scale: 1.05 }}
        >
          Explore
          <motion.span 
            className="text-sm"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
} 