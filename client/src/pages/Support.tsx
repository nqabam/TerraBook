import { MessageCircle, Mail, Phone, BookOpen, Search, HelpCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Support = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "Available 24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      action: "Send Email",
      available: "Response within 2 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM EST"
    }
  ];

  const knowledgeBase = [
    {
      category: "Getting Started",
      articles: [
        "How to register your eco-friendly property",
        "Setting up your property profile",
        "Understanding our listing requirements",
        "Uploading photos and descriptions"
      ]
    },
    {
      category: "Property Management",
      articles: [
        "Managing your availability calendar",
        "Updating your property information",
        "Handling guest communications",
        "Processing bookings and payments"
      ]
    },
    {
      category: "Eco-Certifications",
      articles: [
        "LEED certification process",
        "Green Key certification guide",
        "EarthCheck standards overview",
        "Sustainability best practices"
      ]
    },
    {
      category: "Billing & Pricing",
      articles: [
        "Understanding our pricing plans",
        "Payment methods and billing",
        "Upgrading or downgrading plans",
        "Cancellation and refund policy"
      ]
    }
  ];

  const commonQuestions = [
    {
      question: "How do I list my property?",
      answer: "Click 'Register Your Property' and follow our 6-step registration process. You'll need basic business information, photos, and details about your eco-friendly practices."
    },
    {
      question: "What makes a property eco-friendly?",
      answer: "We accept properties with environmental certifications, sustainable practices like solar power, water conservation, waste recycling, organic offerings, or other green initiatives."
    },
    {
      question: "How long does approval take?",
      answer: "Most properties are reviewed and approved within 48 hours. Complex applications may take up to 5 business days."
    },
    {
      question: "Do you charge commission on bookings?",
      answer: "No! We don't charge commission on bookings. You keep 100% of your booking revenue. We only charge our transparent monthly subscription fee."
    },
    {
      question: "Can I manage multiple properties?",
      answer: "Yes! You can manage multiple eco-friendly properties from a single account with our multi-property dashboard."
    }
  ];

  const filteredKnowledgeBase = knowledgeBase.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help You?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow text-center">
              <CardHeader>
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <option.icon className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <p className="text-gray-600">{option.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 mb-4">{option.available}</p>
                <Button className="w-full bg-gradient-green">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Knowledge Base */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <BookOpen className="h-6 w-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Knowledge Base</h2>
          </div>
          
          {searchTerm && filteredKnowledgeBase.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No articles found for "{searchTerm}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(searchTerm ? filteredKnowledgeBase : knowledgeBase).map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <a
                          href="#"
                          className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-2"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>{article}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Questions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {commonQuestions.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-600 ml-7">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-green-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-green-100 mb-8">
            Our support team is here to assist you with any questions or issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Support;