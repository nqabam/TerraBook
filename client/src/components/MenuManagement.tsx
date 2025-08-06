import { useState } from "react";
import { Plus, Edit, Trash2, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MenuManagement = () => {
  const [menuItems] = useState([
    {
      id: 1,
      name: "Organic Garden Salad",
      category: "Salads",
      price: 14.99,
      description: "Fresh organic greens with seasonal vegetables",
      available: true,
      rating: 4.8,
      orders: 45
    },
    {
      id: 2,
      name: "Sustainable Salmon",
      category: "Main Course",
      price: 28.99,
      description: "Wild-caught salmon with quinoa and roasted vegetables",
      available: true,
      rating: 4.7,
      orders: 32
    },
    {
      id: 3,
      name: "Plant-Based Burger",
      category: "Main Course",
      price: 18.99,
      description: "House-made patty with local vegetables and organic bun",
      available: false,
      rating: 4.6,
      orders: 28
    },
    {
      id: 4,
      name: "Fair Trade Coffee",
      category: "Beverages",
      price: 4.99,
      description: "Ethically sourced coffee beans from local roastery",
      available: true,
      rating: 4.9,
      orders: 89
    }
  ]);

  const categories = ["All", "Salads", "Main Course", "Beverages", "Desserts"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-lg">{item.price}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {item.orders} orders today
                </span>
                <Badge 
                  variant={item.available ? "default" : "secondary"}
                  className={item.available ? "bg-green-600" : ""}
                >
                  {item.available ? "Available" : "Out of Stock"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;