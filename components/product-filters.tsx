"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  const categoryOptions = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Toys"]
  const brandOptions = ["AudioTech", "FitTech", "SoundWave", "ChargeTech", "GameTech", "VisionTech"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...categories, category] : categories.filter((c) => c !== category)
    setCategories(newCategories)
    updateFilters({ categories: newCategories })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...brands, brand] : brands.filter((b) => b !== brand)
    setBrands(newBrands)
    updateFilters({ brands: newBrands })
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    updateFilters({ priceRange: { min: value[0], max: value[1] } })
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(rating)
    updateFilters({ minRating: rating })
  }

  const handleStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    updateFilters({ inStockOnly: checked })
  }

  const updateFilters = (newFilter: any) => {
    const filters = {
      categories,
      brands,
      priceRange: { min: priceRange[0], max: priceRange[1] },
      minRating,
      inStockOnly,
      ...newFilter,
    }
    onFilterChange(filters)
  }

  const clearAllFilters = () => {
    setCategories([])
    setBrands([])
    setPriceRange([0, 1000])
    setMinRating(0)
    setInStockOnly(false)
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      inStockOnly: false,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categoryOptions.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brandOptions.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={brands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => handleRatingChange(checked ? rating : 0)}
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 text-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating ? "text-amber-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span>& up</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => handleStockChange(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
