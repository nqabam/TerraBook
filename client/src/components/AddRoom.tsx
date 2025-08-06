import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner'; 

const AddRoom = () => {
  const [roomData, setRoomData] = useState<({
    name: string;
    type: string;
    price: string;
    description: string;
    amenities: string[];
    images: string[]
  })>({
    name: "",
    type: "",
    price: "",
    description: "",
    amenities: [],
    images: []
  });

  const roomTypes = [
    { value: "single", label: "Single Bed" },
    { value: "double", label: "Double Bed" },
    { value: "luxury", label: "Luxury Room" },
    { value: "family", label: "Family Suite" }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Room Added Successfully!", {
      description: "Your room has been added to the listings.",
    });
    console.log("Room data:", roomData);
    
    // Reset form
    setRoomData({
      name: "",
      type: "",
      price: "",
      description: "",
      amenities: [],
      images: []
    });
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
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Ocean View Suite"
                  value={roomData.name}
                  onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Room Type *</Label>
                <Select onValueChange={(value) => setRoomData({ ...roomData, type: value })}>
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
              <Label htmlFor="price">Price per Night (ZAR) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="150"
                value={roomData.price}
                onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Room Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the room features, size, and unique characteristics..."
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                rows={4}
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
              <Label className="text-base font-medium">Room Images</Label>
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors mt-3">
                <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload room photos</p>
                <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB each (minimum 3 photos)</p>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Add Room
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;