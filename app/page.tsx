import Navbar from '@/components/Navbar'
import PropertyCard from '@/components/PropertyCard'
import { Button } from '@/components/ui/button'
import { Search, MapPin, HomeIcon, AlertCircle } from 'lucide-react'
import Link from 'next/link'

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

// Mock data for when backend is unavailable
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
  }
]

async function getRecentProperties(): Promise<{ properties: Property[], isBackendAvailable: boolean }> {
  try {
    console.log('Attempting to fetch properties from backend...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch('https://nobroker-app-backend.onrender.com/api/properties?limit=6', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeoutId)
    
    console.log('Response status:', response.status)
    console.log('Response content-type:', response.headers.get('content-type'))
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response received:', text.substring(0, 200))
      throw new Error('Backend returned non-JSON response')
    }
    
    const data = await response.json()
    console.log('Successfully fetched properties:', data)
    
    const properties = Array.isArray(data) ? data : (data.properties || [])
    return { properties, isBackendAvailable: true }
    
  } catch (error) {
    console.error('Error fetching properties from backend:', error)
    console.log('Using mock data as fallback')
    return { properties: mockProperties, isBackendAvailable: false }
  }
}

export default async function Home() {
  const { properties, isBackendAvailable } = await getRecentProperties()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Backend Status Banner */}
      {!isBackendAvailable && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Backend server is currently unavailable. Showing sample data.
                <Link href="/debug" className="ml-2 underline hover:no-underline">
                  Test Connection
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover thousands of properties for rent and sale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search?type=rent">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Find Rentals
                </Button>
              </Link>
              <Link href="/search?type=sale">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                  <Search className="h-5 w-5 mr-2" />
                  Buy Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white shadow-sm -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="office">Office</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Any Budget</option>
                  <option value="0-50000">Under ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                  <option value="200000+">Above ₹2,00,000</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link href="/search" className="w-full">
                  <Button className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isBackendAvailable ? 'Recent Properties' : 'Sample Properties'}
            </h2>
            <p className="text-lg text-gray-600">
              {isBackendAvailable 
                ? 'Discover the latest properties added to our platform'
                : 'Explore our property marketplace with these sample listings'
              }
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties available
              </h3>
              <p className="text-gray-600 mb-4">
                Properties will appear here once they are added to the platform.
              </p>
              <Link href="/search">
                <Button variant="outline">
                  Browse All Properties
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/search">
              <Button size="lg" variant="outline">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
