class CategoryService {
  constructor() {
    this.tableName = 'category'
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
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color'
    ]
  }

  // Get only updateable fields for create/update operations
  getUpdateableFields() {
    return ['Name', 'Tags', 'Owner', 'color']
  }

  // Fetch all categories
  async fetchCategories() {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        fields: this.getAllFields(),
        orderBy: [
          {
            fieldName: 'Name',
            SortType: 'ASC'
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // Get a single category by ID
  async getCategoryById(categoryId) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        fields: this.getAllFields()
      }

      const response = await this.apperClient.getRecordById(this.tableName, categoryId, params)
      
      if (!response || !response.data) {
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${categoryId}:`, error)
      throw error
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = {}
      
      updateableFields.forEach(field => {
        if (categoryData[field] !== undefined) {
          filteredData[field] = categoryData[field]
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
      
      throw new Error('Failed to create category')
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  // Update existing category
  async updateCategory(categoryId, categoryData) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = { Id: categoryId }
      
      updateableFields.forEach(field => {
        if (categoryData[field] !== undefined) {
          filteredData[field] = categoryData[field]
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
      
      throw new Error('Failed to update category')
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  // Delete category
  async deleteCategory(categoryIds) {
    try {
      if (!this.apperClient) {
        throw new Error('Apper client not initialized')
      }

      const params = {
        RecordIds: Array.isArray(categoryIds) ? categoryIds : [categoryIds]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success) {
        return true
      }
      
      throw new Error('Failed to delete category')
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  // Get default categories for initial setup
  getDefaultCategories() {
    return [
      { Name: 'Work', color: 'bg-blue-500' },
      { Name: 'Personal', color: 'bg-green-500' },
      { Name: 'Shopping', color: 'bg-purple-500' },
      { Name: 'Health', color: 'bg-red-500' }
    ]
  }
}

export default new CategoryService()