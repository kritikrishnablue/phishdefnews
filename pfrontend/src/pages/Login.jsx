import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 max-w-md mx-auto flex items-center justify-center min-h-[80vh] theme-transition ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div 
        className={`shadow-lg rounded-lg p-8 w-full border theme-transition ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Sign In
        </motion.h1>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover-lift ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaLock className="inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover-lift ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                required
                disabled={loading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            </div>
          </div>
          
          <motion.button 
            type="submit" 
            className="w-full px-4 py-3 bg-cyan-500 text-white border border-cyan-600 rounded-lg hover:bg-cyan-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-animated"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
          
          {error && (
            <motion.div 
              className={`text-center text-sm border rounded-lg p-3 ${
                isDarkMode 
                  ? 'text-red-400 bg-red-900/20 border-red-500' 
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.form>

        {/* Register Link */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className={`font-semibold transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-cyan-400 hover:text-cyan-300' 
                  : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              Sign up here
            </Link>
          </p>
        </motion.div>

        {/* Forgot Password */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a 
            href="#" 
            className={`text-sm transition-colors duration-300 ${
              isDarkMode 
                ? 'text-cyan-400 hover:text-cyan-300' 
                : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            Forgot your password?
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
