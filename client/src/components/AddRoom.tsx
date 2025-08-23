import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useAppContext } from "@/context/appContext.tsx";

const AddRoom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken, axios } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roomData, setRoomData] = useState({
    roomName: "",
    roomType: "",
    pricePerNight: "",
    roomDescription: "",
    amenities: [] as string[],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const roomTypes = [
    { value: "Single", label: "Single" },
    { value: "Double", label: "Double" },
    { value: "Luxury", label: "Luxury" },
    { value: "Suite", label: "Suite" }
  ];

  const amenitiesList = [
    "Mountain View",
    "Sea View",
    "Room Service",
    "Free WiFi",
    "Air Conditioning",
    "Mini Bar",
    "Balcony",
    "TV",
    "Coffee Machine",
    "Safe",
    "Spa Access",
    "Gym Access"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`Invalid file type: ${file.name}. Please upload JPG, PNG, or WebP files.`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();

      // Validate minimum images
      if (selectedFiles.length < 3) {
        toast.error("Minimum 3 images required", {
          description: "Please upload at least 3 room photos.",
        });
        setIsSubmitting(false);
        return;
      }

      // Convert price to number
      const priceNumber = parseFloat(roomData.pricePerNight);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        toast.error("Invalid price", {
          description: "Please enter a valid price greater than 0.",
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("roomName", roomData.roomName);
      formData.append("roomType", roomData.roomType);
      formData.append("pricePerNight", priceNumber.toString());
      formData.append("roomDescription", roomData.roomDescription);
      formData.append("amenities", JSON.stringify(roomData.amenities));

      // Append all image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log("Submitting room data with FormData");

      const response = await axios.post("/api/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response);

      if (response.data.success) {
        toast.success("Room Added Successfully!", {
          description: "Your room has been added to your property.",
        });

        // Reset form
        setRoomData({
          roomName: "",
          roomType: "",
          pricePerNight: "",
          roomDescription: "",
          amenities: [],
        });
        setSelectedFiles([]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(response.data.message || "Failed to add room");
      }
    } catch (error: any) {
      console.error("Room addition error:", error);
      
      let errorMessage = "There was an error adding the room. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Room Addition Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRoomData({
      roomName: "",
      roomType: "",
      pricePerNight: "",
      roomDescription: "",
      amenities: [],
    });
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Room</h1>
        <p className="text-gray-600 mt-2">Create a new room listing for your property</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name *</Label>
                <Input
                  id="roomName"
                  placeholder="e.g., Ocean View Suite"
                  value={roomData.roomName}
                  onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select 
                  value={roomData.roomType} 
                  onValueChange={(value) => setRoomData({ ...roomData, roomType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Price per Night (ZAR) *</Label>
              <Input
                id="pricePerNight"
                type="number"
                placeholder="1500"
                value={roomData.pricePerNight}
                onChange={(e) => setRoomData({ ...roomData, pricePerNight: e.target.value })}
                required
                min="1"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomDescription">Room Description *</Label>
              <Textarea
                id="roomDescription"
                placeholder="Describe the room features, size, and unique characteristics..."
                value={roomData.roomDescription}
                onChange={(e) => setRoomData({ ...roomData, roomDescription: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label className="text-base font-medium">Room Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={roomData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRoomData({
                            ...roomData,
                            amenities: [...roomData.amenities, amenity]
                          });
                        } else {
                          setRoomData({
                            ...roomData,
                            amenities: roomData.amenities.filter(a => a !== amenity)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Room Images *</Label>
              <input
                ref={fileInputRef}
                type="file"
                id="image-upload"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <label htmlFor="image-upload">
                <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors mt-3 cursor-pointer">
                  <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload room photos</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG, WebP up to 10MB each (minimum 3 photos)</p>
                  <Button type="button" variant="outline" onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}>
                    Choose Files
                  </Button>
                </div>
              </label>

              {/* Display selected images */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected images ({selectedFiles.length}/3 minimum)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Room image ${index + 1}`}
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

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || selectedFiles.length < 3}
              >
                {isSubmitting ? "Adding Room..." : "Add Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;