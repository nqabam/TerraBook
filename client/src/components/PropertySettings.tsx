import { useState } from "react";
import { Settings, Wifi, Car, Coffee, Utensils, Dumbbell, Camera, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const PropertySettings = () => {
  const [propertyInfo, setPropertyInfo] = useState({
    name: "Ocean View Resort",
    description: "A luxury beachfront resort with stunning ocean views and world-class amenities.",
    address: "123 Beach Boulevard, Miami, FL 33139",
    phone: "+1 (305) 555-0123",
    email: "info@oceanviewresort.com",
    website: "www.oceanviewresort.com",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  });

  const [amenities, setAmenities] = useState([
    { id: "wifi", name: "Free WiFi", icon: Wifi, enabled: true },
    { id: "parking", name: "Free Parking", icon: Car, enabled: true },
    { id: "breakfast", name: "Complimentary Breakfast", icon: Coffee, enabled: true },
    { id: "restaurant", name: "On-site Restaurant", icon: Utensils, enabled: true },
    { id: "gym", name: "Fitness Center", icon: Dumbbell, enabled: false },
    { id: "pool", name: "Swimming Pool", icon: Camera, enabled: true }
  ]);

  const toggleAmenity = (amenityId: string) => {
    setAmenities(prev => prev.map(amenity => 
      amenity.id === amenityId 
        ? { ...amenity, enabled: !amenity.enabled }
        : amenity
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Property Settings</h2>
          <p className="text-muted-foreground">Manage your property information and preferences</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your property's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    value={propertyInfo.name}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select defaultValue="hotel">
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="guesthouse">Guest House</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={propertyInfo.description}
                  onChange={(e) => setPropertyInfo(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={propertyInfo.address}
                  onChange={(e) => setPropertyInfo(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={propertyInfo.phone}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={propertyInfo.email}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={propertyInfo.website}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in Time</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={propertyInfo.checkInTime}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, checkInTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-out Time</Label>
                  <Input
                    id="checkOut"
                    type="time"
                    value={propertyInfo.checkOutTime}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Amenities</CardTitle>
              <CardDescription>Select the amenities available at your property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <amenity.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                    <Switch
                      checked={amenity.enabled}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Active Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {amenities.filter(a => a.enabled).map((amenity) => (
                    <Badge key={amenity.id} variant="secondary">
                      {amenity.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Policies</CardTitle>
              <CardDescription>Set your property's booking and guest policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancellation">Cancellation Policy</Label>
                <Textarea
                  id="cancellation"
                  value={propertyInfo.cancellationPolicy}
                  onChange={(e) => setPropertyInfo(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minStay">Minimum Stay (nights)</Label>
                  <Input id="minStay" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStay">Maximum Stay (nights)</Label>
                  <Input id="maxStay" type="number" defaultValue="30" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">House Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Smoking Allowed</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pets Allowed</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Events/Parties Allowed</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suitable for Children</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Media</CardTitle>
              <CardDescription>Upload photos and videos of your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <Button className="mt-4" variant="outline">
                  Choose Files
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-3">Current Photos</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySettings;