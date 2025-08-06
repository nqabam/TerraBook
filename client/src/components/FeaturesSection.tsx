import { Shield, Users, TrendingUp, Globe, Award, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Eco-Credentials",
      description: "We verify all environmental certifications and sustainability practices to ensure authentic eco-friendly businesses."
    },
    {
      icon: Users,
      title: "Eco-Conscious Community",
      description: "Connect with environmentally aware travelers who specifically seek sustainable accommodation and dining options."
    },
    {
      icon: TrendingUp,
      title: "Boost Your Visibility",
      description: "Get featured on our platform and reach customers who prioritize environmental responsibility in their travel choices."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Showcase your sustainable business to eco-travelers worldwide through our international platform."
    },
    {
      icon: Award,
      title: "Sustainability Recognition",
      description: "Earn badges and recognition for your environmental efforts, highlighting your commitment to sustainability."
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Track and display your environmental impact metrics, showing guests how they're contributing to a greener planet."
    }
  ];

  return (
    <section id="features" className="py-20 bg-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full mb-4">
            <Leaf className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Why Choose TerraBook</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Grow Your Sustainable Business
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join a platform dedicated to promoting environmentally responsible hospitality. 
            Connect with eco-conscious travelers and showcase your commitment to sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 bg-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="bg-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-green-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Join hundreds of eco-friendly businesses already making a positive impact on the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-green-600">100+</div>
                <div className="text-sm text-gray-600">Registered Properties</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-green-600">15k+</div>
                <div className="text-sm text-gray-600">Eco-Travelers</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-green-600">750k+</div>
                <div className="text-sm text-gray-600">CO₂ Reduced (kg)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;