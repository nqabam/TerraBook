import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Utensils, Mountain, BookOpen } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: string;
  activeSubcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

const categories = {
  accommodations: {
    label: "Accommodations",
    icon: Bed,
    subcategories: ["Hotels", "B&Bs", "Eco-lodges", "Camping"]
  },
  restaurants: {
    label: "Restaurants", 
    icon: Utensils,
    subcategories: ["Fine Dining", "Casual", "Local Cuisine", "Vegan/Organic"]
  },
  "eco-actions": {
    label: "Eco Actions & Events",
    icon: Mountain,
    subcategories: ["Wildlife Tours", "Hiking", "Cultural Tours", "Adventure Sports", "Events", "Workshops"]
  },
  "eco-reads": {
    label: "Eco Reads",
    icon: BookOpen,
    subcategories: ["Conservation Articles", "Travel Tips", "Sustainability Guides", "Field Guides"]
  }
};

export default function CategoryTabs({ 
  activeCategory, 
  activeSubcategory, 
  onCategoryChange, 
  onSubcategoryChange 
}: CategoryTabsProps) {
  
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    // Set first subcategory as default when switching categories
    const firstSubcategory = categories[category as keyof typeof categories].subcategories[0];
    onSubcategoryChange(firstSubcategory);
  };

  return (
    <div className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {Object.entries(categories).map(([key, category]) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === key;
            
            return (
              <Button
                key={key}
                onClick={() => handleCategoryClick(key)}
                variant={isActive ? "default" : "outline"}
                className={`px-6 py-3 font-semibold rounded-xl transition-all border-2 ${
                  isActive
                    ? 'bg-terra-primary text-white border-terra-primary hover:bg-terra-dark'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-terra-light hover:text-terra-primary'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Subcategory Tabs */}
        {activeCategory && (
          <div className="flex flex-wrap justify-center gap-3">
            {categories[activeCategory as keyof typeof categories].subcategories.map((subcategory) => {
              const isActive = activeSubcategory === subcategory;
              
              return (
                <Badge
                  key={subcategory}
                  variant={isActive ? "default" : "secondary"}
                  className={`px-4 py-2 font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-terra-light text-terra-darker hover:bg-terra-primary hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-terra-light hover:text-terra-darker'
                  }`}
                  onClick={() => onSubcategoryChange(subcategory)}
                >
                  {subcategory}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
