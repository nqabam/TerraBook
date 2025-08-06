import { CheckCircle, Star, TrendingUp, Shield, Globe, Zap, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Globe,
      title: "Global Exposure",
      description: "Get your eco-friendly property featured on our international platform",
      benefits: [
        "Reach eco-conscious travelers worldwide",
        "Multi-language support",
        "SEO-optimized listings",
        "Social media promotion"
      ]
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your property's performance with detailed insights",
      benefits: [
        "Booking analytics dashboard",
        "Revenue tracking",
        "Guest behavior insights",
        "Competitive analysis"
      ]
    },
    {
      icon: Shield,
      title: "Eco-Certification Support",
      description: "Get help with environmental certifications and standards",
      benefits: [
        "LEED certification guidance",
        "Green Key assistance",
        "Sustainability audits",
        "Best practices consulting"
      ]
    },
    {
      icon: Star,
      title: "Premium Marketing",
      description: "Enhanced marketing tools to boost your property's visibility",
      benefits: [
        "Featured property placements",
        "Professional photography service",
        "Content marketing support",
        "Email campaign management"
      ]
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Streamlined booking system for seamless guest experience",
      benefits: [
        "Real-time availability",
        "Automated confirmations",
        "Payment processing",
        "Guest communication tools"
      ]
    },
    {
      icon: CheckCircle,
      title: "24/7 Support",
      description: "Round-the-clock assistance for you and your guests",
      benefits: [
        "Dedicated account manager",
        "Technical support",
        "Guest support services",
        "Emergency assistance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions to help eco-friendly properties thrive in the sustainable tourism market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <service.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-green-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-green-100">
            Join over 50 eco-friendly properties already growing with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Register Your Property
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Services;