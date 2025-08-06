import { useState } from "react";
import { Save, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface DayHours {
  open: string; // e.g. "09:00"
  close: string; // e.g. "17:00"
  closed: boolean;
}

interface Hours {
  hours: Record<Day, DayHours>;
}

interface Services {
  dineIn: boolean;
  takeout: boolean;
  delivery: boolean;
  catering: boolean;
  reservations: boolean;
}

interface PaymentMethods {
  cash: boolean;
  creditCard: boolean;
  debitCard: boolean;
  digitalWallet: boolean;
  giftCards: boolean;
}

interface Policies {
  cancellationPolicy: string;
  dietaryAccommodations: string;
  smokingPolicy: string;
  petPolicy: string;
}

interface Sustainability {
  localSourcing: number;
  organicIngredients: number;
  wasteReduction: number;
  energyEfficiency: number;
  compostProgram: boolean;
  recyclingProgram: boolean;
}

interface Settings extends Hours {
  // Basic Information
  restaurantName: string;
  description: string;
  cuisine: string;
  priceRange: string;
  capacity: number;

  // Contact Information
  phone: string;
  email: string;
  website: string;
  address: string;

  // Services
  services: Services;

  // Payment Options
  paymentMethods: PaymentMethods;

  // Policies
  policies: Policies;

  // Sustainability
  sustainability: Sustainability;
}

const cuisineTypes = [
  { value: "american", label: "American" },
  { value: "modern-american", label: "Modern American" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "asian", label: "Asian" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "farm-to-table", label: "Farm to Table" },
];

const priceRanges = [
  { value: "$", label: "$ - Budget (Under $15)" },
  { value: "$$", label: "$$ - Moderate ($15-30)" },
  { value: "$$$", label: "$$$ - Upscale ($30-50)" },
  { value: "$$$$", label: "$$$$ - Fine Dining ($50+)" },
];

const days: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const RestaurantSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    // Basic Information
    restaurantName: "Green Garden Restaurant",
    description:
      "A sustainable dining experience featuring locally sourced, organic ingredients and eco-friendly practices.",
    cuisine: "modern-american",
    priceRange: "$$",
    capacity: 80,

    // Contact Information
    phone: "+1 (555) 123-4567",
    email: "info@greengardenrestaurant.com",
    website: "www.greengardenrestaurant.com",
    address: "123 Green Street, Eco City, EC 12345",

    // Hours
    hours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "14:00", closed: false },
      sunday: { open: "00:00", close: "00:00", closed: true },
    },

    // Services
    services: {
      dineIn: true,
      takeout: true,
      delivery: true,
      catering: true,
      reservations: true,
    },

    // Payment Options
    paymentMethods: {
      cash: true,
      creditCard: true,
      debitCard: true,
      digitalWallet: true,
      giftCards: true,
    },

    // Policies
    policies: {
      cancellationPolicy: "24 hours notice required for group reservations",
      dietaryAccommodations:
        "We accommodate most dietary restrictions with advance notice",
      smokingPolicy: "Non-smoking establishment",
      petPolicy:
        "Service animals welcome, outdoor seating allows well-behaved pets",
    },

    // Sustainability
    sustainability: {
      localSourcing: 85,
      organicIngredients: 70,
      wasteReduction: 60,
      energyEfficiency: 80,
      compostProgram: true,
      recyclingProgram: true,
    },
  });

  const handleSave = () => {
    console.log("Saving restaurant settings:", settings);
    // Handle save logic
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Restaurant Settings</h2>
          <p className="text-gray-600">Manage your restaurant information and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Restaurant Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload restaurant logo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      value={settings.restaurantName}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, restaurantName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Seating Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={settings.capacity}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, capacity: parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cuisine Type</Label>
                    <Select
                      value={settings.cuisine}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, cuisine: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineTypes.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <Select
                      value={settings.priceRange}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, priceRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              {days.map((day) => (
                <div key={day} className="flex items-center gap-4 mb-4">
                  <Label className="capitalize w-24">{day}</Label>
                  <Input
                    type="time"
                    value={settings.hours[day].open}
                    disabled={settings.hours[day].closed}
                    onChange={(e) => {
                      const open = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day], open },
                        },
                      }));
                    }}
                  />
                  <Input
                    type="time"
                    value={settings.hours[day].close}
                    disabled={settings.hours[day].closed}
                    onChange={(e) => {
                      const close = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day], close },
                        },
                      }));
                    }}
                  />
                  <Switch
                    checked={settings.hours[day].closed}
                    onCheckedChange={(checked) => {
                      setSettings((prev) => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: {
                            ...prev.hours[day],
                            closed: checked,
                            open: checked ? "00:00" : "09:00",
                            close: checked ? "00:00" : "17:00",
                          },
                        },
                      }));
                    }}
                  />
                  <span>Closed</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {Object.entries(settings.services).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        services: { ...prev.services, [key]: checked },
                      }))
                    }
                  />
                  <Label className="capitalize">{key}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {Object.entries(settings.paymentMethods).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        paymentMethods: { ...prev.paymentMethods, [key]: checked },
                      }))
                    }
                  />
                  <Label className="capitalize">{key}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cancellation Policy</Label>
                <Textarea
                  value={settings.policies.cancellationPolicy}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, cancellationPolicy: e.target.value },
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Dietary Accommodations</Label>
                <Textarea
                  value={settings.policies.dietaryAccommodations}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, dietaryAccommodations: e.target.value },
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Smoking Policy</Label>
                <Textarea
                  value={settings.policies.smokingPolicy}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, smokingPolicy: e.target.value },
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Pet Policy</Label>
                <Textarea
                  value={settings.policies.petPolicy}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, petPolicy: e.target.value },
                    }))
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability */}
        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Local Sourcing (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.sustainability.localSourcing}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: {
                        ...prev.sustainability,
                        localSourcing: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Organic Ingredients (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.sustainability.organicIngredients}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: {
                        ...prev.sustainability,
                        organicIngredients: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Waste Reduction (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.sustainability.wasteReduction}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: {
                        ...prev.sustainability,
                        wasteReduction: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Energy Efficiency (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.sustainability.energyEfficiency}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: {
                        ...prev.sustainability,
                        energyEfficiency: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.sustainability.compostProgram}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: { ...prev.sustainability, compostProgram: checked },
                    }))
                  }
                />
                <Label>Compost Program</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.sustainability.recyclingProgram}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      sustainability: { ...prev.sustainability, recyclingProgram: checked },
                    }))
                  }
                />
                <Label>Recycling Program</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantSettings;
