import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Input } from "@/components/ui/travelersUI/input";
import { Textarea } from "@/components/ui/travelersUI/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/travelersUI/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/travelersUI/form";
import { 
  Calendar,
  Users,
  Camera,
  Globe,
  Award,
  CheckCircle,
  TreePine,
  Heart,
  Target,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/context/appContext"; // Import the AppContext

const eventFormSchema = z.object({
  eventName: z.string().min(3, "Event name must be at least 3 characters"),
  organizer: z.string().min(2, "Organizer name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventType: z.string().min(1, "Please select an event type"),
  location: z.string().min(2, "Location is required"),
  date: z.string().min(1, "Event date is required"),
  duration: z.string().min(1, "Duration is required"),
  capacity: z.string().min(1, "Expected attendance is required"),
  description: z.string().min(100, "Please provide at least 100 characters describing your event"),
  ecoFocus: z.string().min(50, "Please describe the environmental focus of your event"),
  website: z.string().optional(),
  ticketPrice: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export default function ListYourEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { axios, getToken } = useAppContext(); // Get axios instance and getToken from context

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: "",
      organizer: "",
      email: "",
      phone: "",
      eventType: "",
      location: "",
      date: "",
      duration: "",
      capacity: "",
      description: "",
      ecoFocus: "",
      website: "",
      ticketPrice: "",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    console.log('Event form submitted:', data);
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const token = await getToken();
      
      // Send data to the backend API using axios from context
      const response = await axios.post('/api/events', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast("Event Submission Received!", {
          description: "We'll review your event and publish it within 3 business days.",
        });
        
        form.reset();
      } else {
        throw new Error(response.data.message || 'Failed to submit event');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast("Submission Failed", {
        description: error.response?.data?.message || error.message || "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Reach Eco-Conscious Audience",
      description: "Connect with travelers who actively seek sustainable experiences"
    },
    {
      icon: Globe,
      title: "Free Promotion",
      description: "Get your event featured on our platform at no cost"
    },
    {
      icon: Award,
      title: "Credibility Boost",
      description: "Association with TerraBook adds environmental credibility"
    },
    {
      icon: Camera,
      title: "Professional Support",
      description: "Access to marketing resources and promotional materials"
    }
  ];

  const eventTypes = [
    "Wildlife Conservation Tour",
    "Eco-Education Workshop",
    "Community Clean-up",
    "Sustainable Farming Experience",
    "Nature Photography Walk",
    "Marine Conservation Activity",
    "Cultural Heritage Tour",
    "Green Technology Showcase",
    "Environmental Film Screening",
    "Other"
  ];

  const guidelines = [
    "Must have clear environmental or conservation focus",
    "Should support local communities or conservation efforts",
    "Must be suitable for eco-conscious travelers",
    "Should align with sustainable tourism principles",
    "Event organizers must be reputable and verified"
  ];

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            List Your Eco-Event
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Share your sustainable events with eco-conscious travelers and make a positive impact on conservation and communities
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TreePine className="w-4 h-4 mr-2" />
              Conservation Focus
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Heart className="w-4 h-4 mr-2" />
              Community Impact
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Target className="w-4 h-4 mr-2" />
              Educational Value
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits and Guidelines */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why List Your Event?
            </h2>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-green-200 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Event Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Fast Track Review</span>
                </div>
                <p className="text-green-700 text-sm">
                  Events focused on conservation, education, or community development 
                  get priority review and featured placement on our platform.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Event Submission Form */}
          <div>
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle>Submit Your Event</CardTitle>
                <p className="text-gray-600">
                  Tell us about your sustainable event and its environmental impact
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Marine Conservation Beach Clean-up" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organizer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organizer/Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name or organization" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+27 12 345 6789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {eventTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Province or specific venue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="3 hours, Half day, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Attendance</FormLabel>
                            <FormControl>
                              <Input placeholder="20-30 people" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourevent.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ticketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Price (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="R150 or Free" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your event, activities, what participants will learn or do, and any special features..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ecoFocus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Environmental Impact & Focus</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explain how your event promotes conservation, supports communities, educates about sustainability, etc..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Event..." : "Submit Event for Review"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}