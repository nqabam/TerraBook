import { Star, TrendingUp, Users, Award, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const LearnMore = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Your Revenue",
      description: "Properties on our platform see an average 35% increase in bookings within 6 months."
    },
    {
      icon: Users,
      title: "Reach Eco-Conscious Travelers",
      description: "Connect with the growing market of environmentally aware travelers worldwide."
    },
    {
      icon: Award,
      title: "Get Certified Recognition",
      description: "Showcase your sustainability certifications and attract premium guests."
    },
    {
      icon: Star,
      title: "Premium Marketing Support",
      description: "Professional photography, SEO optimization, and featured listings included."
    }
  ];

  const testimonials = [
    {
      name: "Cici Vuvu",
      property: "Green Mountain Lodge",
      content: "Since joining GreenInn, our bookings have increased by 40%. The platform really understands sustainable tourism.",
      rating: 5
    },
    {
      name: "Blair Sinclair",
      property: "Eco Beach Resort",
      content: "The support team helped us get our LEED certification. Now we're attracting guests who truly value sustainability.",
      rating: 5
    },
    {
      name: "Wanda Javis",
      property: "Solar Valley Retreat",
      content: "The analytics dashboard is incredible. We can track our environmental impact alongside our business metrics.",
      rating: 5
    }
  ];

  const stats = [
    { number: "1,247+", label: "Eco Properties Listed" },
    { number: "98%", label: "Owner Satisfaction Rate" },
    { number: "25M kg", label: "CO₂ Emissions Saved" },
    { number: "150+", label: "Countries Reached" }
  ];

  const faqs = [
    {
      question: "How much does it cost to list my property?",
      answer: "We offer both free and premium listing options. Free listings include basic features, while premium listings get enhanced visibility and advanced analytics."
    },
    {
      question: "What makes a property 'eco-friendly'?",
      answer: "We accept properties with environmental certifications, sustainable practices like solar power, water conservation, waste recycling, or organic offerings."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Register Your Property' and complete our 6-step registration process. Our team will review and approve your listing within 48 hours."
    },
    {
      question: "Do you help with certifications?",
      answer: "Yes! We provide guidance and support for various eco-certifications including LEED, Green Key, and EarthCheck standards."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-green-600">TerraBook</span>?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join the world's leading platform for sustainable hospitality. 
            We help eco-friendly properties connect with conscious travelers while growing their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a onClick={ () => ('/register') } >
              <Button
                size="lg"
                className="bg-gradient-green text-lg px-8 py-6"
                onClick={() => navigate('/register')}
              >
                Start Your Journey
              </Button>
            </a>
            <a onClick={ () => ('/contact') }>
              <Button
                size="lg"
                variant="outline"
                className="border-green-500 text-green-600 text-lg px-8 py-6"
                onClick={() => navigate('/contact')}
              >
                Speak to Our Team
              </Button>
            </a>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How We Help Your Property Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-green rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Property Owners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.property}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-friendly properties making sustainable tourism the new standard.
          </p>
          <Button
            size="lg"
            className="bg-gradient-green text-lg px-12 py-6"
            onClick={() => navigate('/register')}
          >
            Register Your Property Now
          </Button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default LearnMore;