class TaskService {
  constructor() {
    this.tableName = 'task'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  // Get all fields for fetch operations (includes all fields regardless of visibility)
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'description', 'due_date', 'priority', 'category', 'is_completed', 'created_at'
    ]
  }

  // Get only updateable fields for create/update operations
  getUpdateableFields() {
    return [
      'Name', 'Tags', 'Owner', 'title', 'description', 'due_date', 
      'priority', 'category', 'is_completed', 'created_at'
    ]
  }

  // Fetch all tasks with optional filtering
  async fetchTasks(filters = {}) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        fields: this.getAllFields(),
        orderBy: [
          {
            fieldName: 'created_at',
            SortType: 'DESC'
          }
        ]
      }

      // Add filtering if provided
      if (filters.category && filters.category !== 'all') {
        params.where = [
          {
            fieldName: 'category',
            operator: 'ExactMatch',
            values: [filters.category]
          }
        ]
      }

      if (filters.isCompleted !== undefined) {
        const completedFilter = {
          fieldName: 'is_completed',
          operator: 'ExactMatch',
          values: [filters.isCompleted]
        }
        
        if (params.where) {
          params.where.push(completedFilter)
        } else {
          params.where = [completedFilter]
        }
      }

      if (filters.searchTerm) {
        const searchFilter = {
          fieldName: 'title',
          operator: 'Contains',
          values: [filters.searchTerm]
        }
        
        if (params.where) {
          params.where.push(searchFilter)
        } else {
          params.where = [searchFilter]
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  }

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        fields: this.getAllFields()
      }

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params)
      
      if (!response || !response.data) {
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw error
    }
  }

  // Create new task(s)
  async createTask(taskData) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = {}
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('Failed to create task')
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  // Update existing task
  async updateTask(taskId, taskData) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = { Id: taskId }
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      throw new Error('Failed to update task')
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // Delete task(s)
  async deleteTask(taskIds) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        RecordIds: Array.isArray(taskIds) ? taskIds : [taskIds]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success) {
        return true
      }
      
      throw new Error('Failed to delete task')
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }
}

export default new TaskService()