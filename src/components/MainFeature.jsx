import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

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

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    updateCategoryTaskCounts()
  }, [tasks])

  const updateCategoryTaskCounts = () => {
    const updatedCategories = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.id && !task.isCompleted).length
    }))
    setCategories(updatedCategories)
  }

  const handleTaskSubmit = (e) => {
    e.preventDefault()
    
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const taskData = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      categoryId: taskForm.categoryId,
      isCompleted: editingTask ? editingTask.isCompleted : false,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    }

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task))
      toast.success('Task updated successfully!')
    } else {
      setTasks([...tasks, taskData])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setTaskForm({
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
      dueDate: task.dueDate,
      priority: task.priority,
      categoryId: task.categoryId
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ))
    
    const task = tasks.find(t => t.id === taskId)
    if (task && !task.isCompleted) {
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
    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.isCompleted) ||
      (filterStatus === 'pending' && !task.isCompleted)
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
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
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add New Task</span>
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
                  <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-semibold">{category.taskCount}</span>
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
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-secondary"
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
                : categories.find(c => c.id === selectedCategory)?.name + ' Tasks'
              }
            </h3>
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

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
                  const category = categories.find(c => c.id === task.categoryId)
                  const dateStatus = getDateStatus(task.dueDate)
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className={`task-card group ${task.isCompleted ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <motion.button
                          onClick={() => toggleTaskCompletion(task.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="mt-1 flex-shrink-0"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            task.isCompleted 
                              ? 'bg-primary border-primary' 
                              : 'border-surface-300 hover:border-primary'
                          }`}>
                            {task.isCompleted && (
                              <ApperIcon name="Check" className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </motion.button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={`font-medium text-surface-900 dark:text-white ${
                              task.isCompleted ? 'line-through text-surface-500' : ''
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
                              >
                                <ApperIcon name="Edit2" className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteTask(task.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                                <div className={`w-2 h-2 ${category?.color} rounded-full`}></div>
                                <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                                  {category?.name}
                                </span>
                              </div>

                              {/* Priority */}
                              <span className={`category-badge text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Due Date */}
                            {task.dueDate && (
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