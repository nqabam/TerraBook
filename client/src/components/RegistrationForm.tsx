import { useState } from "react";
import { Building, MapPin, Check, FileText, House, ChefHat, Mountain, Store, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  type FormData = {
    propertyType: string;
    businessName: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    province: string;
    description: string;
    certifications: string[];
    amenities: string[];
    termsAccepted: boolean;
    privacyAccepted: boolean;
    marketingAccepted: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    propertyType: "",
    businessName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    province: "",
    description: "",
    certifications: [],
    amenities: [],
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false
  });

  const steps = [
    { id: 1, title: "Property Type", icon: Building2 },
    { id: 2, title: "Basic Information", icon: MapPin },
    { id: 3, title: "Sustainability", icon: Check },
    { id: 4, title: "Terms & Conditions", icon: FileText },
  ];

  const propertyTypes = [
    { value: "hotel", label: "Hotel", icon: Building },
    { value: "restaurant", label: "Restaurant", icon: ChefHat },
    { value: "guesthouse", label: "Guest House", icon: House },
    { value: "resort", label: "Eco Resort", icon: Mountain },
    { value: "cafe", label: "Café", icon: Store },
    { value: "hostel", label: "Hostel", icon: Building2 }
  ];

  const certifications = [
    "LEED Certified",
    "Green Key",
    "EarthCheck",
    "ISO 14001",
    "Rainforest Alliance",
    "Organic Certification",
    "Fair Trade",
    "Carbon Neutral"
  ];

  const ecoAmenities = [
    "Solar Panels",
    "Rainwater Harvesting",
    "Waste Recycling",
    "Organic Garden",
    "Electric Vehicle Charging",
    "Energy Efficient Lighting",
    "Water Conservation Systems",
    "Composting Facility"
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
  if (!formData.termsAccepted || !formData.privacyAccepted) {
    toast("Terms Required", {
      description: "Please accept the terms and conditions to continue.",
    });
    return;
  }

  try {
    // Get token from localStorage (or wherever you store it)
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to register property.");
      return;
    }

    const fullFormData = {
      ...formData, // if your backend expects 'province' instead of country
      pricing: {
        baseRate: "0",
        currency: "ZAR",
        specialOffers: "",
      },
    };

    const response = await fetch("/api/accommodations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Send the token here
      },
      body: JSON.stringify(fullFormData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("Registration Successful! Redirecting to your Admin Panel.");
      localStorage.setItem("propertyType", formData.propertyType);
      setTimeout(() => (window.location.href = "/admin"), 1500);
    } else {
      toast.error(data.message || "Failed to register property.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Network or server error.");
  }
};



  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">What type of property do you own?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {propertyTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.value}
                onClick={() => setFormData({ ...formData, propertyType: type.value })}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  formData.propertyType === type.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="font-medium text-gray-800">{type.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="business@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="https://yourbusiness.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="Street address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Province *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, province: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GP">Gauteng</SelectItem>
              <SelectItem value="KZN">KwaZulu Natal</SelectItem>
              <SelectItem value="WC">Western Cape</SelectItem>
              <SelectItem value="NW">North West</SelectItem>
              <SelectItem value="EC">Eastern Cape</SelectItem>
              <SelectItem value="FS">Free State</SelectItem>
              <SelectItem value="NC">Nothern Cape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your eco-friendly business..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Environmental Certifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {certifications.map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Checkbox
                id={cert}
                checked={formData.certifications.includes(cert)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData({
                      ...formData,
                      certifications: [...formData.certifications, cert]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      certifications: formData.certifications.filter(c => c !== cert)
                    });
                  }
                }}
              />
              <Label htmlFor={cert} className="text-sm">{cert}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Eco-Friendly Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ecoAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData({
                      ...formData,
                      amenities: [...formData.amenities, amenity]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      amenities: formData.amenities.filter(a => a !== amenity)
                    });
                  }
                }}
              />
              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Partnership Terms & Conditions</h3>
        
        <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto mb-6">
          <h4 className="font-semibold mb-3">GreenInn Property Partnership Agreement</h4>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>1. Property Listing Terms:</strong> By registering your property with GreenInn, 
              you agree to maintain accurate and up-to-date information about your property, including 
              availability, pricing, and amenities.
            </p>
            <p>
              <strong>2. Eco-Friendly Standards:</strong> You certify that your property meets our 
              sustainability standards and will continue to implement eco-friendly practices throughout 
              our partnership.
            </p>
            <p>
              <strong>3. Guest Services:</strong> You agree to provide excellent service to guests 
              booked through our platform and respond to inquiries within 24 hours.
            </p>
            <p>
              <strong>4. Payment Terms:</strong> Monthly subscription fees are due on the anniversary 
              of your registration. No commission is charged on bookings.
            </p>
            <p>
              <strong>5. Cancellation Policy:</strong> Either party may terminate this agreement with 
              30 days written notice. No early termination fees apply.
            </p>
            <p>
              <strong>6. Data Usage:</strong> We may use your property information for marketing 
              purposes and to improve our platform services.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: !!checked })}
            />
            <Label htmlFor="terms" className="text-sm">
              I have read and accept the Partnership Terms & Conditions *
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => setFormData({ ...formData, privacyAccepted: !!checked })}
            />
            <Label htmlFor="privacy" className="text-sm">
              I accept the Privacy Policy and Data Processing Agreement *
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              checked={formData.marketingAccepted}
              onCheckedChange={(checked) => setFormData({ ...formData, marketingAccepted: !!checked })}
            />
            <Label htmlFor="marketing" className="text-sm">
              I consent to receive marketing communications from GreenInn (optional)
            </Label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>🌱 Welcome to the GreenInn Family!</strong> Once approved, you'll receive 
            access to your admin panel and our support team will help you optimize your listing 
            for maximum visibility.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="register" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Register Your Eco-Friendly Property</h2>
          <p className="text-lg text-gray-600">Join our network of sustainable businesses in 4 simple steps</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-green text-white rounded-t-lg">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-6 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center min-w-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentStep >= step.id
                        ? "bg-white text-green-600"
                        : "bg-green-400 text-white"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-2 ${
                        currentStep > step.id ? "bg-white" : "bg-green-400"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <CardTitle className="text-center">
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !formData.propertyType}
                  className="bg-gradient-green"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-gradient-green"
                  disabled={!formData.termsAccepted || !formData.privacyAccepted}
                >
                  Submit Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationForm;