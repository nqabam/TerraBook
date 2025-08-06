import { Search, BarChart3, Shield, Camera, Globe, Zap, Users, Award, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Your property appears in search results when travelers look for eco-friendly accommodations",
      details: [
        "Google-optimized listings",
        "Keyword optimization",
        "Local search visibility",
        "Meta tags optimization"
      ]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboard to track your property's performance and guest behavior",
      details: [
        "Booking analytics",
        "Revenue tracking",
        "Guest demographics",
        "Performance metrics"
      ]
    },
    {
      icon: Shield,
      title: "Eco-Certification Support",
      description: "Get help achieving and displaying environmental certifications",
      details: [
        "LEED certification guidance",
        "Green Key assistance",
        "Sustainability audits",
        "Best practices consulting"
      ]
    },
    {
      icon: Camera,
      title: "Professional Photography",
      description: "High-quality photos that showcase your property's sustainable features",
      details: [
        "Professional photographer visit",
        "Eco-feature highlights",
        "Virtual tour creation",
        "Image optimization"
      ]
    },
    {
      icon: Globe,
      title: "Global Exposure",
      description: "Reach eco-conscious travelers from around the world",
      details: [
        "Multi-language support",
        "International marketing",
        "Social media promotion",
        "Partner network access"
      ]
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Streamlined booking system that converts visitors into guests",
      details: [
        "Real-time availability",
        "Automated confirmations",
        "Payment processing",
        "Calendar synchronization"
      ]
    },
    {
      icon: Users,
      title: "Guest Management",
      description: "Tools to manage guest communications and reviews effectively",
      details: [
        "Message center",
        "Review management",
        "Guest feedback system",
        "Communication templates"
      ]
    },
    {
      icon: Award,
      title: "Premium Listing",
      description: "Featured placement and enhanced visibility for your property",
      details: [
        "Homepage featuring",
        "Priority search results",
        "Badge highlighting",
        "Special promotions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the tools and features designed to help your eco-friendly property succeed
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform combines cutting-edge technology with sustainable tourism expertise 
                to give your eco-friendly property the competitive edge it deserves.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Real-time performance analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Certification support and guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Globe className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Global marketing reach</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-green rounded-lg p-8 text-white">
              <h3 className="text-black font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-green-700 mb-6">
                Join over 1,200 eco-friendly properties already using our platform to grow their business.
              </p>
              <Button
                size="lg"
                className="bg-green-300 text-green-900 hover:bg-gray-100 w-full"
                onClick={() => navigate('/login')}
              >
                Register Your Property
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose TerraBook Over Other Platforms?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-bold text-gray-900 mb-4">Other Platforms</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Generic listings</li>
                  <li>High commission fees</li>
                  <li>Limited support</li>
                  <li>No eco-focus</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-white rounded-lg p-6 shadow-lg transform scale-105">
                <h3 className="font-bold text-green-900 mb-4">TerraBook Platform</h3>
                <ul className="space-y-2 text-green-600">
                  <li><strong>✓</strong> Eco-specialized listings</li>
                  <li><strong>✓</strong> Competitive rates</li>
                  <li><strong>✓</strong> 24/7 dedicated support</li>
                  <li><strong>✓</strong> Sustainability focus</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-bold text-gray-900 mb-4">DIY Approach</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Time-consuming</li>
                  <li>Technical challenges</li>
                  <li>Limited reach</li>
                  <li>No marketing support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Features;