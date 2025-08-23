import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/appContext.tsx";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  category?: string;
  price: number;
  images?: string[];
  spicyLevel?: string;
  ingredients?: string[];
  allergens?: string[];
  available: boolean;
  preparationTime?: number;
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const { getToken, axios } = useAppContext();

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const token = await getToken();
      const response = await axios.get("/api/menu-items/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMenuItems(response.data.menuItems);
      } else {
        throw new Error(response.data.message || "Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Toggle item availability
  interface ToggleAvailabilityResponse {
    success: boolean;
    available: boolean;
    message?: string;
  }

  const toggleAvailability = async (
    itemId: string,
    _currentStatus: boolean
  ): Promise<void> => {
    try {
      const token = await getToken();
      const response = await axios.post<ToggleAvailabilityResponse>(
        "/api/menu-items/toggle-availability",
        { menuItemId: itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setMenuItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId
              ? { ...item, available: response.data.available }
              : item
          )
        );
        toast.success("Availability updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    try {
      const token = await getToken();
      const response = await axios.delete(`/api/menu-items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Remove item from local state
        setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));
        toast.success("Menu item deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  // Extract unique categories from menu items
  const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category).filter((cat): cat is string => typeof cat === "string")))];

  // Filter menu items based on search, category, and availability
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvailability = availabilityFilter === "all" || 
                               (availabilityFilter === "available" && item.available) ||
                               (availabilityFilter === "unavailable" && !item.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant menu items</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="unavailable">Unavailable Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} of {menuItems.length} items
        </p>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items found. Try adjusting your filters or add a new menu item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteMenuItem(item._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {item.images && item.images.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-lg">{item.price}</span>
                  </div>
                  {item.spicyLevel && item.spicyLevel !== "none" && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      {item.spicyLevel} spice
                    </Badge>
                  )}
                </div>

                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      Ingredients: {item.ingredients.join(", ")}
                    </p>
                  </div>
                )}

                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-red-500">
                      Allergens: {item.allergens.join(", ")}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`available-${item._id}`}
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item._id, item.available)}
                    />
                    <Label htmlFor={`available-${item._id}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </Label>
                  </div>
                  {/* Fixed the preparationTime check */}
                  {item.preparationTime !== undefined && item.preparationTime !== null && item.preparationTime > 0 && (
                    <span className="text-sm text-gray-600">
                      {item.preparationTime} min
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;