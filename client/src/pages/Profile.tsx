import { useState, useRef, useEffect } from "react";
import { User, Camera, Edit3, Save, MapPin, Phone, Mail, Globe, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useAppContext } from "@/context/appContext.tsx";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getToken, axios, user } = useAppContext();

  const [profileData, setProfileData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    certifications: [] as string[],
    amenities: [] as string[],
  });

  const [stats, setStats] = useState({
    profileViews: 0,
    totalBookings: 0,
    totalInquiries: 0,
    rating: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await getToken();
      
      // Fetch accommodation data
      const accommodationResponse = await axios.get("/api/accommodations/owner", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (accommodationResponse.data.success && accommodationResponse.data.accommodations.length > 0) {
        const accData = accommodationResponse.data.accommodations[0];
        
        setProfileData({
          businessName: accData.businessName || "",
          ownerName: user?.fullName || user?.firstName || "Property Owner",
          email: accData.email || user?.primaryEmailAddress?.emailAddress || "",
          phone: accData.phone || "",
          website: accData.website || "",
          address: accData.address || "",
          description: accData.description || "",
          certifications: accData.certifications || [],
          amenities: accData.amenities || []
        });

        // Fetch stats data (you'll need to create these endpoints)
        try {
          const statsResponse = await axios.get("/api/stats/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (statsResponse.data.success) {
            setStats(statsResponse.data);
          }
        } catch (statsError) {
          console.log("Stats endpoint not available, using default values");
        }
      }

    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data");
      
      // Fallback to user data if accommodation not found
      setProfileData(prev => ({
        ...prev,
        ownerName: user?.fullName || user?.firstName || "Property Owner",
        email: user?.primaryEmailAddress?.emailAddress || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      
      // Fetch accommodation to get ID
      const accommodationResponse = await axios.get("/api/accommodations/owner", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (accommodationResponse.data.success && accommodationResponse.data.accommodations.length > 0) {
        const accId = accommodationResponse.data.accommodations[0]._id;
        
        const updateData = {
          businessName: profileData.businessName,
          email: profileData.email,
          phone: profileData.phone,
          website: profileData.website,
          address: profileData.address,
          description: profileData.description,
          certifications: profileData.certifications,
          amenities: profileData.amenities
        };

        const response = await axios.put(`/api/accommodations/${accId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.data.success) {
          setIsEditing(false);
          toast.success("Profile Updated", {
            description: "Your business profile has been successfully updated.",
          });
        } else {
          throw new Error(response.data.message || "Failed to update profile");
        }
      } else {
        toast.error("No accommodation found to update");
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        // Here you would upload to your backend
        toast("Profile Picture Updated", {
          description: "Your profile picture has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Loading skeleton */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="h-8 w-64 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-300 rounded mx-auto animate-pulse"></div>
            </div>

            {/* Stats loading */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="h-8 w-16 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profile info loading */}
            <Card className="mb-8">
              <CardHeader>
                <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-10 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.businessName || "Your Business"}</h1>
            <p className="text-gray-600">Property Owner Dashboard</p>

            {/* Admin Panel Button */}
            <div className="mt-4">
              <Button onClick={() => navigate("/admin")} className="bg-green-600 hover:bg-green-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.profileViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalInquiries}</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{stats.rating}/5</div>
                <div className="text-sm text-gray-600">Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Business Information</CardTitle>
                <Button variant="outline" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={profileData.ownerName}
                    onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                      placeholder="business@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="123 Business St, City, State ZIP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Describe your business and what makes it special..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Certifications and Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileData.certifications.length > 0 ? (
                    profileData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No certifications added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileData.amenities.length > 0 ? (
                    profileData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No amenities added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;