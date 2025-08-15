import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleOAuth } from '../services/googleOAuth';
import { appleOAuth } from '../services/appleOAuth';
import { FaGoogle, FaApple, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState({ google: false, apple: false });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        preferences: {
          topics: [],
          sources: [],
          countries: []
        },
        bookmarks: [],
        liked_articles: []
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className={`p-4 max-w-md mx-auto flex items-center justify-center min-h-[80vh] theme-transition-medium page-transition ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div 
        className={`shadow-lg rounded-lg p-8 w-full border theme-transition-fast hover-lift-enhanced ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          className={`text-2xl font-bold mb-6 text-center gradient-text ${
            isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Create an Account
        </motion.h1>
        
      
         
          
          
        {/* Divider */}
        <motion.div 
          className="relative mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${
              isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
            }`}>or register with email</span>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Username Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaUser className="inline mr-2 icon-sleek" />
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 theme-transition-fast focus-enhanced ${
                isDarkMode 
                  ? `bg-gray-700 text-white placeholder-gray-400 ${errors.username ? 'border-red-500' : 'border-gray-600'}` 
                  : `bg-white text-gray-900 placeholder-gray-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`
              }`}
              required
              disabled={loading}
            />
            {errors.username && (
              <motion.p 
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaEnvelope className="inline mr-2 icon-sleek" />
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 theme-transition-fast focus-enhanced ${
                isDarkMode 
                  ? `bg-gray-700 text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-600'}` 
                  : `bg-white text-gray-900 placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`
              }`}
              required
              disabled={loading}
            />
            {errors.email && (
              <motion.p 
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaLock className="inline mr-2 icon-sleek" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 theme-transition-fast focus-enhanced ${
                  isDarkMode 
                    ? `bg-gray-700 text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-600'}` 
                    : `bg-white text-gray-900 placeholder-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`
                }`}
                required
                disabled={loading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center theme-transition-fast btn-sleek ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <FaEyeSlash className="icon-sleek" /> : <FaEye className="icon-sleek" />}
              </motion.button>
            </div>
            {errors.password && (
              <motion.p 
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaLock className="inline mr-2 icon-sleek" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 theme-transition-fast focus-enhanced ${
                  isDarkMode 
                    ? `bg-gray-700 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}` 
                    : `bg-white text-gray-900 placeholder-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`
                }`}
                required
                disabled={loading}
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center theme-transition-fast btn-sleek ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {showConfirmPassword ? <FaEyeSlash className="icon-sleek" /> : <FaEye className="icon-sleek" />}
              </motion.button>
            </div>
            {errors.confirmPassword && (
              <motion.p 
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            className="w-full px-4 py-3 bg-cyan-500 text-white border border-cyan-600 rounded-lg hover:bg-cyan-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed theme-transition-fast btn-sleek focus-enhanced"
            disabled={loading}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div 
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          {/* Error Display */}
          {/* {error && (
            <div className="text-red-400 text-center text-sm bg-red-900/20 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )} */}
        </motion.form>

        {/* Login Link */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className={`font-semibold theme-transition-fast gradient-text ${
                isDarkMode 
                  ? 'text-cyan-400 hover:text-cyan-300' 
                  : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              Sign in here
            </Link>
          </p>
        </motion.div>

        {/* Terms and Privacy */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            By creating an account, you agree to our{' '}
            <a href="#" className={`theme-transition-fast ${
              isDarkMode 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-cyan-600 hover:text-cyan-700'
            }`}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className={`theme-transition-fast ${
              isDarkMode 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-cyan-600 hover:text-cyan-700'
            }`}>Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
