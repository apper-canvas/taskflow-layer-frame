import React from 'react'

const ApperIcon = ({ name, className = "w-6 h-6", ...props }) => {
  const icons = {
    // Task Management Icons
    CheckSquare: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <polyline points="9,11 12,14 22,4"></polyline>
        <path d="m21,3-3,9H3a2,2 0 0,1-2-2V6a2,2 0 0,1,2-2h14l4-1z"></path>
      </svg>
    ),
    Plus: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    Search: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21,21-4.35-4.35"></path>
      </svg>
    ),
    X: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    Edit2: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    Trash2: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <polyline points="3,6 5,6 21,6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    ),
    Check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    ),
    Calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    
    // Status Icons
    ListTodo: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <rect x="3" y="5" width="6" height="6" rx="1"></rect>
        <path d="m3 17 2 2 4-4"></path>
        <path d="M13 6h8"></path>
        <path d="M13 12h8"></path>
        <path d="M13 18h8"></path>
      </svg>
    ),
    CheckCircle: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>
    ),
    Clock: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12,6 12,12 16,14"></polyline>
      </svg>
    ),
    AlertCircle: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    
    // Theme Icons
    Sun: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    ),
    Moon: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    ),
    
    // Other Icons
    Heart: (
      <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    
    // Fallback
    Default: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    )
  }

  return icons[name] || icons.Default
}

export default ApperIcon