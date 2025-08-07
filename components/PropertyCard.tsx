import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square } from 'lucide-react'

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

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
    
    return type === 'rent' ? `${formatted}/month` : formatted
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={property.images[0] || '/placeholder.svg?height=200&width=300&query=property'}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={property.type === 'rent' ? 'default' : 'secondary'}>
              For {property.type === 'rent' ? 'Rent' : 'Sale'}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-white">
              {property.propertyType}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.area} sq ft
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(property.price, property.type)}
            </div>
            <div className="text-sm text-gray-500">
              by {property.owner.name}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
