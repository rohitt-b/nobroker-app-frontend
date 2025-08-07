'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { X, Filter } from 'lucide-react'

interface FilterOptions {
  location: string
  type: 'rent' | 'sale' | ''
  propertyType: 'apartment' | 'house' | 'villa' | 'office' | ''
  priceRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
}

interface PropertyFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const AMENITIES_LIST = [
  'Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator',
  'Balcony', 'Garden', 'Power Backup', 'Water Supply', 'Internet'
]

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    
    updateFilter('amenities', newAmenities)
  }

  const toggleBedroom = (bedroom: number) => {
    const newBedrooms = filters.bedrooms.includes(bedroom)
      ? filters.bedrooms.filter(b => b !== bedroom)
      : [...filters.bedrooms, bedroom]
    
    updateFilter('bedrooms', newBedrooms)
  }

  const toggleBathroom = (bathroom: number) => {
    const newBathrooms = filters.bathrooms.includes(bathroom)
      ? filters.bathrooms.filter(b => b !== bathroom)
      : [...filters.bathrooms, bathroom]
    
    updateFilter('bathrooms', newBathrooms)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
        {(filters.amenities.length > 0 || filters.bedrooms.length > 0 || filters.bathrooms.length > 0) && (
          <Badge variant="secondary" className="ml-2">
            {filters.amenities.length + filters.bedrooms.length + filters.bathrooms.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 left-0 w-96 z-10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={10000000}
                min={0}
                step={50000}
                className="w-full"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bedrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((bedroom) => (
                  <Button
                    key={bedroom}
                    variant={filters.bedrooms.includes(bedroom) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBedroom(bedroom)}
                  >
                    {bedroom}+ BHK
                  </Button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bathrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((bathroom) => (
                  <Button
                    key={bathroom}
                    variant={filters.bathrooms.includes(bathroom) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBathroom(bathroom)}
                  >
                    {bathroom}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <Button
                    key={amenity}
                    variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={onApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button onClick={onClearFilters} variant="outline" className="flex-1">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
