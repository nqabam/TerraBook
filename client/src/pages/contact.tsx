import {
  Mail, Phone, MapPin, MessageCircle, Send,
  Clock, Facebook, Instagram, Linkedin, Twitter,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message Sent!", {
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Address",
      value: "hello@terrabook.com",
      description: "Send us an email anytime",
      action: "mailto:hello@terrabook.com"
    },
    {
      icon: Phone,
      title: "Phone Number",
      value: "+1 (555) 123-GREEN",
      description: "Call us during business hours",
      action: "tel:+15551234733"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+1 (555) 123-4733",
      description: "Message us on WhatsApp",
      action: "https://wa.me/15551234733"
    },
    {
      icon: MapPin,
      title: "Office Address",
      value: "123 Green Street, Eco City, EC 12345",
      description: "Visit our headquarters",
      action: "#"
    }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/terrabook",
      icon: (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1877F2] text-white">
          <Facebook className="h-5 w-5" />
        </div>
      )
    },
    {
      name: "Instagram",
      url: "https://instagram.com/terrabook",
      icon: (
        <div className="flex items-center justify-center h-8 w-8 rounded-[6px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white">
          <Instagram className="h-5 w-5" />
        </div>
      )
    },
    {
      name: "Twitter",
      url: "https://twitter.com/terrabook",
      icon: (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white">
          <Twitter className="h-5 w-5" />
        </div>
      )
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/terrabook",
      icon: (
        <div className="flex items-center justify-center h-8 w-8 rounded-[4px] bg-[#0A66C2] text-white">
          <Linkedin className="h-5 w-5" />
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8 space-y-16">
        <a href="/">
          <Button
            variant="ghost"
            className="mb-6 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </a>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about listing your eco-friendly property? We're here to help!
          </p>
        </div>

        {/* ROW 1: Contact Info and Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Business Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <method.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                      <a
                        href={method.action}
                        className="text-green-600 font-medium hover:text-green-700"
                      >
                        {method.value}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Socials */}
          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROW 2: Full-Width Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-green">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Contact;
