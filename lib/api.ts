const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nobroker-app-backend.onrender.com/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  requireAuth?: boolean
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    requireAuth = false
  } = options

  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // Add authentication header if required
  if (requireAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }
  }

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData (browser will set it with boundary)
      delete (config.headers as any)['Content-Type']
      config.body = body
    } else {
      config.body = JSON.stringify(body)
    }
  }

  try {
    console.log(`Making API request to: ${url}`)
    const response = await fetch(url, config)
    
    console.log(`Response status: ${response.status}`)
    
    // Handle different response types
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error Response: ${errorText}`)
      
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        // If not JSON, use the text as error message
        errorMessage = errorText || errorMessage
      }
      
      throw new ApiError(response.status, errorMessage)
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('API Response data:', data)
      return data
    } else {
      const text = await response.text()
      console.log('API Response text:', text)
      return text
    }
  } catch (error) {
    console.error('API Request failed:', error)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    throw new Error('Network error. Please check your connection and try again.')
  }
}

// Specific API functions with better error handling
export const authApi = {
  register: (userData: any) => 
    apiRequest('/auth/register', { method: 'POST', body: userData }),
  
  login: (credentials: any) => 
    apiRequest('/auth/login', { method: 'POST', body: credentials }),
  
  getProfile: () => 
    apiRequest('/auth/me', { requireAuth: true }),
  
  updateProfile: (profileData: any) => 
    apiRequest('/auth/profile', { method: 'PUT', body: profileData, requireAuth: true }),
}

export const propertyApi = {
  getAll: async (params?: URLSearchParams) => {
    try {
      const endpoint = params ? `/properties?${params}` : '/properties'
      return await apiRequest(endpoint)
    } catch (error) {
      console.error('Error in propertyApi.getAll:', error)
      return []
    }
  },
  
  getById: (id: string) => 
    apiRequest(`/properties/${id}`),
  
  search: async (params: URLSearchParams) => {
    try {
      return await apiRequest(`/properties/search?${params}`)
    } catch (error) {
      console.error('Error in propertyApi.search:', error)
      return []
    }
  },
  
  create: (propertyData: FormData) => 
    apiRequest('/properties', { 
      method: 'POST', 
      body: propertyData, 
      requireAuth: true 
    }),
  
  update: (id: string, propertyData: any) => 
    apiRequest(`/properties/${id}`, { 
      method: 'PUT', 
      body: propertyData, 
      requireAuth: true 
    }),
  
  delete: (id: string) => 
    apiRequest(`/properties/${id}`, { 
      method: 'DELETE', 
      requireAuth: true 
    }),
  
  getMyProperties: () => 
    apiRequest('/properties/my-properties', { requireAuth: true }),
  
  toggleStatus: (id: string, isActive: boolean) => 
    apiRequest(`/properties/${id}/toggle-status`, { 
      method: 'PATCH', 
      body: { isActive }, 
      requireAuth: true 
    }),
}

export const messageApi = {
  getByProperty: (propertyId: string) => 
    apiRequest(`/messages?propertyId=${propertyId}`, { requireAuth: true }),
  
  send: (messageData: any) => 
    apiRequest('/messages', { 
      method: 'POST', 
      body: messageData, 
      requireAuth: true 
    }),
}
