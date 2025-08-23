import { useState, useEffect } from "react";
import { Settings, Wifi, Car, Coffee, Utensils, Dumbbell, Bed, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/appContext.tsx";
import { toast } from 'sonner';

const PropertySettings = () => {
  const { getToken, axios } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  type Accommodation = {
    _id: string;
    businessName?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    amenities?: string[];
    propertyType?: string;
    // add other fields as needed
  };

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  type Room = {
    _id: string;
    roomName?: string;
    roomType?: string;
    pricePerNight?: number;
    amenities?: string[];
    isAvailable?: boolean;
    propertyType?: string; // Add this if needed for your UI
  };

  const [rooms, setRooms] = useState<Room[]>([]);
  const [propertyInfo, setPropertyInfo] = useState({
    businessName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    propertyType: "hotel"
  });

  const [amenities, setAmenities] = useState([
    { id: "wifi", name: "Free WiFi", icon: Wifi, enabled: false },
    { id: "parking", name: "Free Parking", icon: Car, enabled: false },
    { id: "breakfast", name: "Complimentary Breakfast", icon: Coffee, enabled: false },
    { id: "restaurant", name: "On-site Restaurant", icon: Utensils, enabled: false },
    { id: "gym", name: "Fitness Center", icon: Dumbbell, enabled: false },
    { id: "pool", name: "Swimming Pool", enabled: false }
  ]);

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = async () => {
    try {
      const token = await getToken();
      
      // Fetch accommodation data
      const accommodationResponse = await axios.get("/api/accommodations/owner", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (accommodationResponse.data.success && accommodationResponse.data.accommodations.length > 0) {
        const accData = accommodationResponse.data.accommodations[0];
        setAccommodation(accData);
        
        setPropertyInfo(prev => ({
          ...prev,
          businessName: accData.businessName || "",
          description: accData.description || "",
          address: accData.address || "",
          phone: accData.phone || "",
          email: accData.email || "",
          website: accData.website || "",
          checkInTime: accData.checkInTime || "15:00",
          checkOutTime: accData.checkOutTime || "11:00",
          cancellationPolicy: accData.cancellationPolicy || "Free cancellation up to 24 hours before check-in"
        }));

        // Set amenities from accommodation data
        if (accData.amenities) {
          setAmenities(prev => prev.map(amenity => ({
            ...amenity,
            enabled: accData.amenities.includes(amenity.name)
          })));
        }
      }

      // Fetch rooms data
      const roomsResponse = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (roomsResponse.data.success) {
        setRooms(roomsResponse.data.rooms || []);
      }

    } catch (error: any) {
      console.error("Error fetching property data:", error);
      toast.error("Failed to load property data");
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setAmenities(prev => prev.map(amenity => 
      amenity.id === amenityId 
        ? { ...amenity, enabled: !amenity.enabled }
        : amenity
    ));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      
      // Prepare amenities array from enabled amenities
      const enabledAmenities = amenities
        .filter(a => a.enabled)
        .map(a => a.name);

      // Update accommodation data
      const updateData = {
        ...propertyInfo,
        amenities: enabledAmenities
      };

      if (!accommodation) {
        throw new Error("Accommodation data is not loaded.");
      }
      const response = await axios.put(`/api/accommodations/${accommodation._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        toast.success("Property settings updated successfully");
        // Refresh data
        await fetchPropertyData();
      } else {
        throw new Error(response.data.message || "Failed to update property");
      }

    } catch (error: any) {
      console.error("Error saving property settings:", error);
      toast.error(error.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Property Settings</h2>
          <p className="text-muted-foreground">Manage your property information and preferences</p>
        </div>
        <Button onClick={handleSaveChanges} disabled={saving}>
          <Settings className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
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
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={propertyInfo.businessName}
                    onChange={(e) => setPropertyInfo(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={propertyInfo.propertyType || "hotel"}
                    onValueChange={(value) =>
                      setPropertyInfo((prev) => ({ ...prev, propertyType: value }))
                    }
                  >
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
                      {amenity.icon && <amenity.icon className="h-5 w-5 text-muted-foreground" />}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Inventory</CardTitle>
              <CardDescription>Manage your property's rooms and availability</CardDescription>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rooms added yet</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/add-room'}>
                    Add Your First Room
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                      <Card key={room._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{room.roomName}</CardTitle>
                              <Badge variant={room.isAvailable ? "default" : "secondary"} className="mt-1">
                                {room.isAvailable ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            <Building className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Type:</span>
                              <span className="text-sm font-medium capitalize">{room.roomType?.toLowerCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Price:</span>
                              <span className="text-sm font-medium">R{room.pricePerNight}/night</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Amenities:</span>
                              <span className="text-sm text-muted-foreground">
                                {room.amenities?.length || 0} amenities
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button variant="outline" onClick={() => window.location.href = '/add-room'}>
                      Add More Rooms
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySettings;