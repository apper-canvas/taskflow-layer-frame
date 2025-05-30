import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'
import TaskService from '../services/TaskService'
import CategoryService from '../services/CategoryService'
import { useSelector } from 'react-redux'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: '1', name: 'Work', color: 'bg-blue-500', taskCount: 0 },
    { id: '2', name: 'Personal', color: 'bg-green-500', taskCount: 0 },
    { id: '3', name: 'Shopping', color: 'bg-purple-500', taskCount: 0 },
    { id: '4', name: 'Health', color: 'bg-red-500', taskCount: 0 }
  ])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    categoryId: '1'
  })

  // Loading states for all operations
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false)

  // Get authentication status
  const { isAuthenticated } = useSelector((state) => state.user)

  // Load tasks and categories from database on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks()
      loadCategories()
    }
  }, [isAuthenticated])

  // Load tasks from database
  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true)
      const filters = {}
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory
      }
      
      if (filterStatus !== 'all') {
        filters.isCompleted = filterStatus === 'completed'
      }
      
      if (searchTerm) {
        filters.searchTerm = searchTerm
      }

      const tasksData = await TaskService.fetchTasks(filters)
      setTasks(tasksData || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Failed to load tasks')
      setTasks([])
    } finally {
      setIsLoadingTasks(false)
    }
  }

  // Load categories from database
  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const categoriesData = await CategoryService.fetchCategories()
      
      if (!categoriesData || categoriesData.length === 0) {
        // Create default categories if none exist
        const defaultCategories = CategoryService.getDefaultCategories()
        for (const category of defaultCategories) {
          await CategoryService.createCategory(category)
        }
        // Reload categories after creating defaults
        const newCategoriesData = await CategoryService.fetchCategories()
        setCategories(newCategoriesData || [])
      } else {
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  // Reload tasks when filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks()
    }
  }, [selectedCategory, filterStatus, searchTerm, isAuthenticated])

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmittingTask) return
    
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const taskData = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      dueDate: taskForm.dueDate,
      due_date: taskForm.dueDate,
      categoryId: taskForm.categoryId,
      category: taskForm.categoryId,
      is_completed: editingTask ? editingTask.is_completed : false,
      created_at: editingTask ? editingTask.created_at : new Date().toISOString(),
      Name: taskForm.title.trim()

    if (editingTask) {
    try {
      setIsSubmittingTask(true)
      
      if (editingTask) {
        await TaskService.updateTask(editingTask.Id, taskData)
        toast.success('Task updated successfully!')
      } else {
        await TaskService.createTask(taskData)
        toast.success('Task created successfully!')
      }
      
      // Reload tasks to get updated data
      await loadTasks()
      resetForm()
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setIsSubmittingTask(false)


  const resetForm = () => {
    setTaskForm({
    if (isSubmittingTask) return
    
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: '1'
    })
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.due_date,
      priority: task.priority,
      categoryId: task.category
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (isDeletingTask) return
    
    try {
      setIsDeletingTask(true)
      await TaskService.deleteTask(taskId)
      toast.success('Task deleted successfully!')
      
      // Reload tasks to get updated data
      await loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    } finally {
      setIsDeletingTask(false)
    }
  }

  const toggleTaskCompletion = async (taskId) => {
    if (isTogglingCompletion) return
    
    const task = tasks.find(t => t.Id === taskId)
    if (!task) return
    
    try {
      setIsTogglingCompletion(true)
      
      const updatedTaskData = {
        is_completed: !task.is_completed
      }
      
      await TaskService.updateTask(taskId, updatedTaskData)
      
      // Reload tasks to get updated data
      await loadTasks()
      
      if (!task.is_completed) {
        toast.success('Great job! Task completed! 🎉')
      } else {
        toast.info('Task marked as incomplete')
      }
    } catch (error) {
      console.error('Error updating task completion:', error)
      toast.error('Failed to update task')
    } finally {
      setIsTogglingCompletion(false)
    }
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
            Please log in to access your tasks
          </h3>
          <p className="text-surface-500 dark:text-surface-400">
            You need to be authenticated to manage your tasks and categories.
          </p>
        </div>
      </div>
    )
  }

      toast.success('Great job! Task completed! 🎉')
    } else {
      toast.info('Task marked as incomplete')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-surface-500 bg-surface-50 border-surface-200'
    }
  }

  const getDateStatus = (dueDate) => {
    if (!dueDate) return { text: '', color: '' }
    
    const date = parseISO(dueDate)
    if (isPast(date) && !isToday(date)) {
      return { text: 'Overdue', color: 'text-red-500' }
    } else if (isToday(date)) {
      return { text: 'Due Today', color: 'text-amber-500' }
    } else if (isTomorrow(date)) {
      return { text: 'Due Tomorrow', color: 'text-blue-500' }
    } else {
      return { text: format(date, 'MMM dd'), color: 'text-surface-500' }
    }
  }

  const filteredTasks = tasks.filter(task => {
    return true // Filtering is now handled by the service
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="lg:col-span-1 space-y-6"
      >
        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 dark:border-surface-700/50">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <motion.button
            onClick={() => setShowTaskForm(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
            disabled={isSubmittingTask || isLoadingTasks}
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>
              {isSubmittingTask ? 'Creating...' : 'Add New Task'}
            </span>
          </motion.button>
          
          {/* Search */}
          <div className="relative mb-4">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm"
              disabled={isLoadingTasks}
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm"
                disabled={isLoadingTasks}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 dark:border-surface-700/50">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                selectedCategory === 'all' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
                <span className="font-medium">All Tasks</span>
              </div>
              <span className="text-sm font-semibold">{tasks.length}</span>
            </motion.button>
            
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${category.color || 'bg-gray-500'} rounded-full`}></div>
                  <span className="font-medium">{category.Name}</span>
                </div>
                <span className="text-sm font-semibold">
                  {tasks.filter(task => task.category === category.Id && !task.is_completed).length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Task Form Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="input-field"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      className="input-field resize-none h-20"
                      placeholder="Add task description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className="input-field"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={taskForm.categoryId}
                      onChange={(e) => setTaskForm({ ...taskForm, categoryId: e.target.value })}
                      className="input-field"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-primary"
                      disabled={isSubmittingTask}
                    >
                      {isSubmittingTask 
                        ? (editingTask ? 'Updating...' : 'Creating...') 
                        : (editingTask ? 'Update Task' : 'Create Task')
                      }
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-secondary"
                      disabled={isSubmittingTask}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/20 dark:border-surface-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
              {selectedCategory === 'all' 
                ? 'All Tasks' 
                : categories.find(c => c.Id === selectedCategory)?.Name + ' Tasks'
              }
            </h3>
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {isLoadingTasks ? 'Loading...' : 
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
            </span>
          </div>
          {isLoadingTasks ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h4 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
                Loading tasks...
              </h4>
            </div>
          ) : filteredTasks.length === 0 ? (
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-8 h-8 text-surface-400" />
              </div>
              <h4 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
                No tasks found
              </h4>
              <p className="text-surface-500 dark:text-surface-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first task'}
              </p>
              <motion.button
                onClick={() => setShowTaskForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Task
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task, index) => {
                  const category = categories.find(c => c.Id === task.category)
                  const dateStatus = getDateStatus(task.due_date)
                  
                  return (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className={`task-card group ${task.is_completed ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <motion.button
                          onClick={() => toggleTaskCompletion(task.Id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="mt-1 flex-shrink-0"
                          disabled={isTogglingCompletion}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            task.is_completed 
                              ? 'bg-primary border-primary' 
                              : 'border-surface-300 hover:border-primary'
                          }`}>
                            {task.is_completed && (
                              <ApperIcon name="Check" className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </motion.button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={`font-medium text-surface-900 dark:text-white ${
                              task.is_completed ? 'line-through text-surface-500' : ''
                            }`}>
                              {task.title}
                            </h4>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => handleEditTask(task)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                disabled={isSubmittingTask || isDeletingTask}
                              >
                                <ApperIcon name="Edit2" className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteTask(task.Id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={isDeletingTask || isSubmittingTask}
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-300 mb-3">
                              {task.description}
                            </p>
                          )}

                          {/* Task Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Category */}
                              <div className="flex items-center space-x-1.5">
                                <div className={`w-2 h-2 ${category?.color || 'bg-gray-500'} rounded-full`}></div>
                                <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                                  {category?.Name}
                                </span>
                              </div>

                              {/* Priority */}
                              <span className={`category-badge text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Due Date */}
                            {task.due_date && (
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" className="w-3 h-3 text-surface-400" />
                                <span className={`text-xs font-medium ${dateStatus.color}`}>
                                  {dateStatus.text}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainFeature