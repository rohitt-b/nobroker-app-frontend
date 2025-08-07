'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, MapPin, Home, AlertCircle } from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: 'rent' | 'sale'
  propertyType: 'apartment' | 'house' | 'villa' | 'office'
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  createdAt: string
  owner: {
    id: string
    name: string
    email: string
  }
}

interface SearchFilters {
  location: string
  type: 'rent' | 'sale' | ''
  propertyType: 'apartment' | 'house' | 'villa' | 'office' | ''
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
}

// Mock data for demo purposes
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Beautiful 2BHK Apartment in Koramangala',
    description: 'Spacious apartment with modern amenities in the heart of Bangalore',
    price: 35000,
    location: 'Koramangala, Bangalore',
    type: 'rent',
    propertyType: 'apartment',
    images: ['/modern-apartment-living.png'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    createdAt: '2024-01-15T10:00:00Z',
    owner: {
      id: 'owner1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    title: 'Luxury Villa for Sale in Whitefield',
    description: 'Premium villa with garden and swimming pool',
    price: 8500000,
    location: 'Whitefield, Bangalore',
    type: 'sale',
    propertyType: 'villa',
    images: ['/luxury-villa.png'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    createdAt: '2024-01-14T15:30:00Z',
    owner: {
      id: 'owner2',
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  },
  {
    id: '3',
    title: 'Office Space in Electronic City',
    description: 'Modern office space perfect for startups and small businesses',
    price: 45000,
    location: 'Electronic City, Bangalore',
    type: 'rent',
    propertyType: 'office',
    images: ['/cluttered-office-desk.png'],
    bedrooms: 0,
    bathrooms: 2,
    area: 800,
    createdAt: '2024-01-13T09:15:00Z',
    owner: {
      id: 'owner3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    }
  },
  {
    id: '4',
    title: '3BHK House for Rent in Indiranagar',
    description: 'Fully furnished house with parking and garden',
    price: 55000,
    location: 'Indiranagar, Bangalore',
    type: 'rent',
    propertyType: 'house',
    images: ['/furnished-house.png'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    createdAt: '2024-01-12T14:20:00Z',
    owner: {
      id: 'owner4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com'
    }
  }
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    type: (searchParams.get('type') as 'rent' | 'sale') || '',
    propertyType: (searchParams.get('propertyType') as 'apartment' | 'house' | 'villa' | 'office') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
  })

  useEffect(() => {
    searchProperties()
  }, [])

  const searchProperties = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      console.log('Searching with params:', queryParams.toString())
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const url = `https://nobroker-app-backend.onrender.com/api/properties${queryParams.toString() ? `?${queryParams}` : ''}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          setProperties(Array.isArray(data) ? data : [])
          setIsBackendAvailable(true)
        } else {
          throw new Error('Backend returned non-JSON response')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error searching properties:', error)
      setError('Backend unavailable. Showing sample data.')
      setIsBackendAvailable(false)
      
      // Filter mock data based on search criteria
      let filteredProperties = mockProperties
      
      if (filters.type) {
        filteredProperties = filteredProperties.filter(p => p.type === filters.type)
      }
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType)
      }
      if (filters.location) {
        filteredProperties = filteredProperties.filter(p => 
          p.location.toLowerCase().includes(filters.location.toLowerCase())
        )
      }
      
      setProperties(filteredProperties)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    searchProperties()
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backend Status Banner */}
        {!isBackendAvailable && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Backend server is currently unavailable. Showing filtered sample data.
              </p>
            </div>
          </div>
        )}

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Properties
          </h1>
          <p className="text-gray-600">
            Find your perfect property from thousands of listings
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Properties</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="office">Office</option>
                </select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Searching...' : `${properties.length} Properties Found`}
            {!isBackendAvailable && (
              <span className="text-sm text-yellow-600 ml-2">(Sample Data)</span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria to find more properties.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
