import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-effect border-b border-white/20 dark:border-surface-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
                <ApperIcon name="CheckSquare" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">TaskFlow</h1>
            </motion.div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-3 rounded-xl bg-white/80 dark:bg-surface-800/80 shadow-card hover:shadow-glow transition-all duration-300"
              >
                <ApperIcon 
                  name={isDarkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-300" 
                />
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-surface-800/80 rounded-xl shadow-card"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                  All tasks synced
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-2 sm:mb-4">
            Your Tasks Today
          </h2>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-2xl">
            Stay organized and productive with your intelligent task management system.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { icon: "ListTodo", label: "Total Tasks", value: "24", color: "text-primary" },
            { icon: "CheckCircle", label: "Completed", value: "12", color: "text-green-500" },
            { icon: "Clock", label: "Pending", value: "8", color: "text-amber-500" },
            { icon: "AlertCircle", label: "Overdue", value: "4", color: "text-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-card hover:shadow-soft transition-all duration-300 border border-white/20 dark:border-surface-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name={stat.icon} className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                <span className={`text-lg sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-surface-600 dark:text-surface-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Task Management Feature */}
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-16 border-t border-surface-200/50 dark:border-surface-700/50 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Heart" className="w-4 h-4 text-red-500" />
              <span className="text-sm text-surface-600 dark:text-surface-300">
                Made with care for productivity enthusiasts
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
              <span>TaskFlow v1.0</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Your data stays local</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home