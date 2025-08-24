import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Input } from "@/components/ui/travelersUI/input";
import { Label } from "@/components/ui/travelersUI/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/travelersUI/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/travelersUI/avatar";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Separator } from "@/components/ui/travelersUI/separator";
import { 
  User, 
  Mail,
  MapPin, 
  Calendar,
  Leaf,
  Award,
  Settings,
  LogOut,
  Edit,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function UserProfile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalSpent: 0,
    ecoImpact: {
      carbonOffset: 0,
      treesPlanted: 0,
      communitiesSupported: 0,
    }
  });

  useEffect(() => {
    if (user) {
      setEditedInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      });

      // In a real app, you would fetch these from your API
      // For now, we'll use mock data for demonstration
      setUserStats({
        totalBookings: 3,
        confirmedBookings: 2,
        totalSpent: 4500,
        ecoImpact: {
          carbonOffset: 7.5,
          treesPlanted: 9,
          communitiesSupported: 3,
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would update the user via your API
      // For Clerk, you might use user.update() or your backend API
      
      toast("Profile Updated", {
        description: "Your profile information has been saved successfully.",
      });
      setIsEditing(false);
      
    } catch (error) {
      console.error("Update error:", error);
      toast("Update Failed", {
        description: "Unable to update profile. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedInfo({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      
      toast("Logged Out",{
        description: "You have been successfully logged out.",
      });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast("Logout Failed", {
        description: "Unable to log out. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to view your profile.
            </p>
            <Button 
              onClick={() => window.location.href = '/sign-in'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalBookings, confirmedBookings, totalSpent, ecoImpact } = userStats;

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="bg-green-600 text-white text-lg">
                  {(user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName || user.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'Your Profile'
                  }
                </h1>
                <p className="text-gray-600">
                  Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="impact">Eco Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {totalBookings}
                  </div>
                  <p className="text-gray-600">Total Bookings</p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {confirmedBookings}
                  </div>
                  <p className="text-gray-600">Confirmed Trips</p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    R{totalSpent.toLocaleString()}
                  </div>
                  <p className="text-gray-600">Total Spent</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No bookings yet</p>
                  <p className="text-sm">Start exploring sustainable travel options!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="border-gray-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedInfo.firstName}
                        onChange={(e) => setEditedInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-gray-300 focus:border-green-600"
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{user.firstName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedInfo.lastName}
                        onChange={(e) => setEditedInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-gray-300 focus:border-green-600"
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{user.lastName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center mt-2">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{user.primaryEmailAddress?.emailAddress}</span>
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Member Since</Label>
                  <div className="flex items-center mt-2">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Unknown'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing Communications</h3>
                    <p className="text-sm text-gray-600">Receive eco-travel tips and special offers</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    Disabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            {/* Eco Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {ecoImpact.carbonOffset}kg
                  </div>
                  <p className="text-gray-600">CO₂ Offset</p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {ecoImpact.treesPlanted}
                  </div>
                  <p className="text-gray-600">Trees Planted</p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {ecoImpact.communitiesSupported}
                  </div>
                  <p className="text-gray-600">Communities Supported</p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Details */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Your Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Carbon Footprint Reduction</h3>
                    <p className="text-gray-600 mb-4">
                      Through your sustainable travel choices, you've helped offset{' '}
                      <span className="font-semibold text-green-600">
                        {ecoImpact.carbonOffset}kg of CO₂
                      </span>{' '}
                      equivalent to taking a car off the road for {Math.round(ecoImpact.carbonOffset / 4.6)} days.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Conservation Efforts</h3>
                    <p className="text-gray-600 mb-4">
                      Your bookings have contributed to planting{' '}
                      <span className="font-semibold text-green-600">
                        {ecoImpact.treesPlanted} trees
                      </span>{' '}
                      and supporting{' '}
                      <span className="font-semibold text-green-600">
                        {ecoImpact.communitiesSupported} local {ecoImpact.communitiesSupported === 1 ? 'community' : 'communities'}
                      </span>{' '}
                      in their conservation efforts.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Eco Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Eco Traveler</p>
                          <p className="text-sm text-gray-600">Made {totalBookings} sustainable bookings</p>
                        </div>
                      </div>
                      
                      {totalBookings >= 5 && (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <Leaf className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-semibold text-gray-900">Green Explorer</p>
                            <p className="text-sm text-gray-600">Committed to sustainable travel</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};