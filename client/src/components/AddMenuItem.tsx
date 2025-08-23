import { useState, useRef } from "react";
import { Plus, DollarSign, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/appContext.tsx";
import { toast } from 'sonner';

type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  preparationTime: string;
  ingredients: string;
  allergens: string[]; 
  available: boolean;
  featured: boolean;
  spicyLevel: string;
};

const AddMenuItem = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    ingredients: "",
    allergens: [],
    available: true,
    featured: false,
    spicyLevel: "none"
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken, axios } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Appetizers", "Salads", "Main Course", "Desserts", "Beverages", "Specials"];
  const allergensList = ["Nuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy", "Fish"];
  const spicyLevels = ["none", "mild", "medium", "hot", "extra-hot"];

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Please upload JPG, PNG, or WebP files.`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    // Check total files limit
    if (selectedFiles.length + validFiles.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = await getToken();

      // Create FormData for file upload
      const formDataObj = new FormData();
      
      // Append text fields
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("price", formData.price);
      formDataObj.append("category", formData.category);
      formDataObj.append("preparationTime", formData.preparationTime || "0");
      formDataObj.append("ingredients", formData.ingredients);
      
      // Append allergens as JSON string (this is the key fix)
      formDataObj.append("allergens", JSON.stringify(formData.allergens));
      
      formDataObj.append("available", formData.available.toString());
      formDataObj.append("featured", formData.featured.toString());
      formDataObj.append("spicyLevel", formData.spicyLevel);

      // Append image files
      selectedFiles.forEach((file) => {
        formDataObj.append("images", file);
      });

      console.log("Submitting form data:", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        allergens: formData.allergens,
        available: formData.available,
        featured: formData.featured,
        spicyLevel: formData.spicyLevel
      });

      const response = await axios.post("/api/menu-items", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Menu Item Added Successfully!", {
          description: "Your menu item has been added to your restaurant.",
        });

        // Reset form
        resetForm();
      } else {
        throw new Error(response.data.message || "Failed to add menu item");
      }
    } catch (error: any) {
      console.error("Menu item addition error:", error);
      
      let errorMessage = "There was an error adding the menu item. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Menu Item Addition Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      preparationTime: "",
      ingredients: "",
      allergens: [],
      available: true,
      featured: false,
      spicyLevel: "none"
    });
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Menu Item</h1>
        <p className="text-gray-600 mt-2">Create a new menu item for your restaurant</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Menu Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Item Images (Max 4)</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each</p>
              </div>

              {/* Display selected images */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected images ({selectedFiles.length}/4)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Menu item ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Organic Caesar Salad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your menu item, including taste, ingredients, and serving style..."
                rows={3}
                required
              />
            </div>

            {/* Pricing and Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ZAR) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                  placeholder="15"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder="List main ingredients separated by commas (e.g., Chicken, Lettuce, Parmesan, Croutons)"
                rows={2}
              />
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {allergensList.map(allergen => (
                  <Badge
                    key={allergen}
                    variant={formData.allergens.includes(allergen) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleAllergenToggle(allergen)}
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
              {formData.allergens.length > 0 && (
                <p className="text-sm text-gray-500">
                  Selected: {formData.allergens.join(", ")}
                </p>
              )}
            </div>

            {/* Spicy Level */}
            <div className="space-y-2">
              <Label>Spicy Level</Label>
              <Select 
                value={formData.spicyLevel} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, spicyLevel: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select spicy level" />
                </SelectTrigger>
                <SelectContent>
                  {spicyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="available">Available</Label>
                  <p className="text-sm text-gray-600">Item is available for ordering</p>
                </div>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Item</Label>
                  <p className="text-sm text-gray-600">Highlight this item on the menu</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding Menu Item..." : "Add Menu Item"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl">
        <p className="text-sm text-green-800">
          <strong>💡 Pro Tip:</strong> Add high-quality images and detailed descriptions to make your menu items more appealing to customers. 
          Highlight any special ingredients or cooking methods that make your dishes unique.
        </p>
      </div>
    </div>
  );
};

export default AddMenuItem;