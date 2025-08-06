import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";

type BillingPeriod = "monthly" | "annual";

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const plans = [
    {
      name: "Starter",
      icon: Star,
      price: billingPeriod === "monthly" ? "Free" : "Free",
      period: billingPeriod === "monthly" ? "per month" : "forever",
      description: "Perfect for getting started with eco-tourism",
      features: [
        "Basic property listing",
        "Up to 5 photos",
        "Basic analytics",
        "Email support",
        "Eco-badge display",
        "Guest messaging"
      ],
      limitations: [
        "Limited visibility",
        "No featured placement",
        "Basic support only"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      icon: Zap,
      price: billingPeriod === "monthly" ? "R1,200" : "R960",
      period: billingPeriod === "monthly" ? "per month" : "per month (billed annually)",
      description: "Enhanced features for growing eco-properties",
      features: [
        "Enhanced property listing",
        "Up to 20 photos",
        "Advanced analytics",
        "Priority support",
        "Eco-certification display",
        "Guest messaging",
        "Calendar integration",
        "SEO optimization",
        "Social media promotion"
      ],
      limitations: [],
      buttonText: "Start 14-Day Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      savings: "R2,880"
    },
    {
      name: "Premium",
      icon: Crown,
      price: billingPeriod === "monthly" ? "R3,000" : "R2,400",
      period: billingPeriod === "monthly" ? "per month" : "per month (billed annually)",
      description: "Complete solution for established eco-businesses",
      features: [
        "Premium property listing",
        "Unlimited photos",
        "Comprehensive analytics",
        "24/7 dedicated support",
        "All certifications display",
        "Guest messaging",
        "Calendar integration",
        "SEO optimization",
        "Social media promotion",
        "Featured homepage placement",
        "Professional photography",
        "Custom booking widget",
        "Multi-language support"
      ],
      limitations: [],
      buttonText: "Start Premium Trial",
      buttonVariant: "default" as const,
      popular: false,
      savings: "R7,200"
    }
  ];

  return (
    <><div className="min-h-screen bg-gray-50 pb-20">
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your eco-friendly property. Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="bg-green-100 inline-flex p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md font-medium ${billingPeriod === "monthly" ? "bg-white text-green-600" : "text-gray-600"}`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium ${billingPeriod === "annual" ? "bg-white text-green-600" : "text-gray-600"}`}
              onClick={() => setBillingPeriod("annual")}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-lg transition-shadow ${plan.popular ? "border-green-500 shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={plan.popular ? "bg-green-50" : ""}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.popular ? "bg-green-100" : "bg-gray-100"}`}>
                    <plan.icon className={`h-6 w-6 ${plan.popular ? "text-green-600" : "text-gray-600"}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-2">/ {plan.period}</span>}
                  {billingPeriod === "annual" && plan.savings && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save {plan.savings} per year
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  className={`w-full mt-6 ${plan.popular ? "bg-gradient-green" : ""}`}
                  variant={plan.buttonVariant}
                  onClick={() => navigate("/login")}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Billing FAQ</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change my plan at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
              },
              {
                question: "Is there a commission on bookings?",
                answer: "No hidden fees! Our pricing is transparent with no commission on bookings. You keep 100% of your booking revenue."
              },
              {
                question: "Do you offer annual discounts?",
                answer: "Yes! Save 20% when you pay annually. Contact our sales team for custom enterprise pricing."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely. No long-term contracts. Cancel anytime with 30 days notice."
              }
            ].map((faq, index) => (
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
        <div className="text-center bg-green-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Eco-Business?</h2>
          <p className="text-xl text-green-100 mb-8">Join thousands of sustainable properties already using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" onClick={() => navigate('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={() => navigate('/contact')}>
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div><BottomNavigation/></>
  );
};

export default Pricing;
