import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Calendar, DollarSign, Eye, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ItineraryVisualBuilder from '@/components/ItineraryVisualBuilder';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface TripPreferences {
  destination?: string;
  duration?: string;
  budget?: string;
  interests?: string[];
  travelStyle?: string;
  dates?: string;
  groupSize?: string;
}

interface ItineraryItem {
  id: string;
  type: 'accommodation' | 'restaurant' | 'activity' | 'eco-read';
  name: string;
  description: string;
  price: string;
  rating: number;
  walkingDistance: string;
  image: string;
  bookingUrl?: string;
  time?: string;
  day?: number;
}

interface SuggestionOption {
  text: string;
  icon?: React.ReactNode;
  category: string;
}

const TravelChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferences, setPreferences] = useState<TripPreferences>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showVisualBuilder, setShowVisualBuilder] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryItem[]>([]);
  const [selectedView, setSelectedView] = useState<'timeline' | 'map'>('timeline');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [modificationField, setModificationField] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationSteps = [
    { 
      field: 'destination', 
      question: "Where would you like to travel?", 
      icon: MapPin,
      suggestions: ["Cape Town", "Johannesburg", "Durban", "Garden Route", "Kruger National Park"]
    },
    { 
      field: 'dates', 
      question: "What dates are you planning to travel?", 
      icon: Calendar,
      suggestions: ["Next weekend", "Next month", "In 3 months", "Flexible dates"]
    },
    { 
      field: 'duration', 
      question: "How many nights will you be staying?", 
      icon: Calendar,
      suggestions: ["2 nights", "3 nights", "5 nights", "7 nights", "10+ nights"]
    },
    { 
      field: 'groupSize', 
      question: "How many people will be traveling?", 
      icon: MapPin,
      suggestions: ["Solo", "Couple (2)", "Family (4)", "Group (6+)", "Business trip"]
    },
    { 
      field: 'budget', 
      question: "What's your budget for this trip?", 
      icon: DollarSign,
      suggestions: ["Budget (under R500/night)", "Mid-range (R500-1500/night)", "Luxury (R1500+/night)", "Flexible budget"]
    },
    { 
      field: 'interests', 
      question: "What are your main interests?", 
      icon: MapPin,
      suggestions: ["Nature & Wildlife", "Culture & History", "Food & Wine", "Adventure Sports", "Beach & Relaxation", "Eco-Tourism"]
    },
    { 
      field: 'travelStyle', 
      question: "What's your travel style?", 
      icon: MapPin,
      suggestions: ["Eco-friendly", "Luxury", "Mid-range", "Budget", "Backpacker", "Family-friendly"]
    },
  ];

  const postItinerarySuggestions: SuggestionOption[] = [
    { text: "Add more activities", icon: <Leaf className="h-3 w-3" />, category: "modify" },
    { text: "Find eco-friendly options", icon: <Leaf className="h-3 w-3" />, category: "eco" },
    { text: "Adjust budget", icon: <Leaf className="h-3 w-3" />, category: "modify" },
    { text: "Change dates", icon: <Leaf className="h-3 w-3" />, category: "modify" },
    { text: "Find sustainable restaurants", icon: <Leaf className="h-3 w-3" />, category: "eco" },
    { text: "Add cultural experiences", icon: <Leaf className="h-3 w-3" />, category: "modify" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showSuggestions]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage("Hi! I'm your Terrabook travel assistant. I'll help you create a personalized itinerary. Let's start with a few questions!");
        setTimeout(() => {
          askNextQuestion();
        }, 1000);
      }, 500);
    }
  }, [isOpen]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setShowSuggestions(false);
  };

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(text, false);
      
      // Show suggestions after bot message (except when showing itinerary)
      if (!text.includes("itinerary") && !text.includes("Ready for")) {
        setTimeout(() => {
          setShowSuggestions(true);
        }, 500);
      }
    }, 1500);
  };

  const askNextQuestion = () => {
    if (currentStep < conversationSteps.length) {
      addBotMessage(conversationSteps[currentStep].question);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };

  const handleSendMessage = (customValue?: string) => {
    const valueToSend = customValue || inputValue;
    if (!valueToSend.trim()) return;

    addMessage(valueToSend, true);
    
    // Handle modification mode
    if (modificationField) {
      const field = modificationField as keyof TripPreferences;
      
      // Handle interests as array
      if (field === 'interests') {
        setPreferences(prev => ({ 
          ...prev, 
          [field]: [...(prev.interests || []), valueToSend] 
        }));
      } else {
        setPreferences(prev => ({ ...prev, [field]: valueToSend }));
      }
      
      addBotMessage(`Great! I've updated your ${modificationField}. Would you like to modify anything else?`);
      setModificationField(null);
      
      // Regenerate itinerary with updated preferences
      setTimeout(() => {
        generateItinerary();
      }, 1000);
    }
    // Process user input based on current step
    else if (currentStep < conversationSteps.length) {
      const currentField = conversationSteps[currentStep].field as keyof TripPreferences;
      
      // Handle interests as array
      if (currentField === 'interests') {
        setPreferences(prev => ({ 
          ...prev, 
          [currentField]: [...(prev.interests || []), valueToSend] 
        }));
      } else {
        setPreferences(prev => ({ ...prev, [currentField]: valueToSend }));
      }
      
      if (currentStep < conversationSteps.length - 1) {
        // Move to next question and ask it directly
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setTimeout(() => {
          addBotMessage(conversationSteps[nextStep].question);
        }, 1000);
      } else {
        // Generate itinerary using API
        setTimeout(() => {
          generateItinerary();
        }, 1000);
      }
    } else {
      // Handle post-itinerary conversation
      handlePostItineraryMessage(valueToSend);
    }

    setInputValue('');
  };

  const handlePostItineraryMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle modification requests by showing specific field suggestions
    if (lowerMessage.includes('budget')) {
      setModificationField('budget');
      addBotMessage("Let's adjust your budget. What's your new budget range?");
    } 
    else if (lowerMessage.includes('destination') || lowerMessage.includes('where') || lowerMessage.includes('place')) {
      setModificationField('destination');
      addBotMessage("Where would you like to travel instead?");
    }
    else if (lowerMessage.includes('date') || lowerMessage.includes('when')) {
      setModificationField('dates');
      addBotMessage("When would you prefer to travel instead?");
    }
    else if (lowerMessage.includes('duration') || lowerMessage.includes('nights') || lowerMessage.includes('stay')) {
      setModificationField('duration');
      addBotMessage("How many nights would you like to stay?");
    }
    else if (lowerMessage.includes('group') || lowerMessage.includes('people') || lowerMessage.includes('person')) {
      setModificationField('groupSize');
      addBotMessage("How many people will be traveling?");
    }
    else if (lowerMessage.includes('interest') || lowerMessage.includes('activity')) {
      setModificationField('interests');
      addBotMessage("What are your main interests?");
    }
    else if (lowerMessage.includes('style') || lowerMessage.includes('travel style')) {
      setModificationField('travelStyle');
      addBotMessage("What's your travel style?");
    }
    else if (lowerMessage.includes('more activities') || lowerMessage.includes('add activit')) {
      addBotMessage("I'd be happy to add more activities! What type of activities are you interested in? (e.g., hiking, museums, shopping)");
    } 
    else if (lowerMessage.includes('eco') || lowerMessage.includes('sustainable')) {
      addBotMessage("Great choice! Let me find more eco-friendly options for you. Are you looking for sustainable accommodations, restaurants, or activities?");
    }
    else if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
      addBotMessage("I can help you find more dining options! What type of cuisine are you interested in?");
    }
    else if (lowerMessage.includes('cultural') || lowerMessage.includes('experience')) {
      addBotMessage("Cultural experiences make trips memorable! Are you interested in museums, local festivals, historical sites, or traditional workshops?");
    }
    else {
      addBotMessage("I can help you modify your itinerary or answer any questions about your trip. What would you like to change or know more about?");
    }
  };

  const getCurrentSuggestions = () => {
    // If we're in modification mode, show suggestions for the specific field
    if (modificationField) {
      const step = conversationSteps.find(step => step.field === modificationField);
      return step ? step.suggestions : [];
    }
    
    if (currentStep < conversationSteps.length) {
      return conversationSteps[currentStep].suggestions;
    } else if (showItinerary) {
      return postItinerarySuggestions.map(s => s.text);
    }
    return [];
  };

  const generateItinerary = async () => {
    const destination = preferences.destination || 'your destination';
    const duration = preferences.duration || '3 nights';
    
    setTimeout(() => {
      addBotMessage(`Perfect! I'm creating your personalized AI-powered itinerary for ${destination}...`);
    }, 500);

    setTimeout(() => {
      addBotMessage(`✨ **Your Personalized Concierge Recommendations:**

Based on your preferences, I'm fetching real data from our database and using AI to create the perfect itinerary for you!`);
    }, 2000);

    try {
      // Call the API endpoint to generate itinerary
      const response = await fetch('http://127.0.0.1:4000/api/chatbot/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      const itinerary = data.itinerary;

      // Convert API response to ItineraryItem format
      const itineraryItems: ItineraryItem[] = [];

      // Add accommodation
      if (itinerary.accommodation) {
        itineraryItems.push({
          id: itinerary.accommodation.id || '1',
          type: 'accommodation',
          name: itinerary.accommodation.title || itinerary.accommodation.name,
          description: itinerary.accommodation.description,
          price: itinerary.accommodation.price || 'Price on request',
          rating: itinerary.accommodation.rating || 4.5,
          walkingDistance: 'Your base',
          image: itinerary.accommodation.image || '/placeholder.svg'
        });
      }

      // Add restaurants
      if (itinerary.restaurants && Array.isArray(itinerary.restaurants)) {
        itinerary.restaurants.forEach((restaurant: any, index: number) => {
          itineraryItems.push({
            id: restaurant.id || `restaurant-${index + 1}`,
            type: 'restaurant',
            name: restaurant.name,
            description: restaurant.description,
            price: restaurant.priceRange || restaurant.price || 'Price on request',
            rating: restaurant.rating || 4.5,
            walkingDistance: `${Math.floor(Math.random() * 10) + 1} min walk`,
            image: restaurant.image || '/placeholder.svg'
          });
        });
      }

      // Add activities
      if (itinerary.activities && Array.isArray(itinerary.activities)) {
        itinerary.activities.forEach((activity: any, index: number) => {
          itineraryItems.push({
            id: activity.id || `activity-${index + 1}`,
            type: 'activity',
            name: activity.title || activity.name,
            description: activity.description,
            price: activity.price || 'Price on request',
            rating: activity.rating || 4.5,
            walkingDistance: `${Math.floor(Math.random() * 10) + 1} min walk`,
            image: activity.image || '/placeholder.svg'
          });
        });
      }

      // Add eco-reads
      if (itinerary.ecoReads && Array.isArray(itinerary.ecoReads)) {
        itinerary.ecoReads.forEach((ecoRead: any, index: number) => {
          itineraryItems.push({
            id: ecoRead.id || `ecoread-${index + 1}`,
            type: 'eco-read',
            name: ecoRead.title || ecoRead.name,
            description: ecoRead.description,
            price: ecoRead.price || 'Free',
            rating: ecoRead.rating || 4.5,
            walkingDistance: `${Math.floor(Math.random() * 10) + 1} min walk`,
            image: ecoRead.image || '/placeholder.svg'
          });
        });
      }

      setGeneratedItinerary(itineraryItems);
      
      const summary = itinerary.summary || `I've created a complete ${duration} itinerary with real data from our database!`;
      addBotMessage(`🎯 **Ready for your interactive itinerary!**

${summary}

Click "View Interactive Itinerary" below to see your timeline view with direct booking options!

You can also continue chatting with me to modify your itinerary or ask questions. 🌿`);
      
      setShowItinerary(true);
      setCurrentStep(conversationSteps.length); // Mark conversation as complete
    } catch (error) {
      console.error('Error generating itinerary:', error);
      addBotMessage(`I apologize, but I encountered an error while generating your itinerary. Let me try with some sample recommendations instead.`);
      
      // Fallback to mock data if API fails
      setTimeout(() => {
        generateMockItinerary();
      }, 1000);
    }
  };

  const generateMockItinerary = () => {
    const destination = preferences.destination || 'your destination';
    const duration = preferences.duration || '3 nights';
    
    // Generate mock itinerary data as fallback
    const mockItinerary: ItineraryItem[] = [
      {
        id: '1',
        type: 'accommodation',
        name: 'Green Valley Eco Lodge',
        description: 'Sustainable luxury lodge in the heart of the city',
        price: 'R850/night',
        rating: 4.8,
        walkingDistance: 'Your base',
        image: '/placeholder.svg'
      },
      {
        id: '2',
        type: 'restaurant',
        name: 'Farm-to-Table Bistro',
        description: 'Local organic cuisine with seasonal ingredients',
        price: 'R200-400/person',
        rating: 4.6,
        walkingDistance: '3 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '3',
        type: 'restaurant',
        name: 'Ocean View Café',
        description: 'Sustainable seafood with panoramic views',
        price: 'R150-350/person',
        rating: 4.7,
        walkingDistance: '5 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '4',
        type: 'restaurant',
        name: 'Rooftop Garden Restaurant',
        description: 'Plant-based menu with city skyline views',
        price: 'R180-320/person',
        rating: 4.5,
        walkingDistance: '7 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '5',
        type: 'activity',
        name: 'Cultural Heritage Walk',
        description: 'Guided tour through historic neighborhoods',
        price: 'R120/person',
        rating: 4.9,
        walkingDistance: '2 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '6',
        type: 'activity',
        name: 'Local Arts Workshop',
        description: 'Hands-on traditional craft experience',
        price: 'R200/person',
        rating: 4.7,
        walkingDistance: '8 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '7',
        type: 'activity',
        name: 'Farmers Market Tour',
        description: 'Early morning market exploration with local guide',
        price: 'R80/person',
        rating: 4.8,
        walkingDistance: '4 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '8',
        type: 'eco-read',
        name: 'City Library Heritage Corner',
        description: 'Local history books and cultural archives',
        price: 'Free',
        rating: 4.5,
        walkingDistance: '6 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '9',
        type: 'eco-read',
        name: 'Cultural Center Reading Room',
        description: 'Traditional stories and folklore collection',
        price: 'R20 entry',
        rating: 4.6,
        walkingDistance: '5 min walk',
        image: '/placeholder.svg'
      },
      {
        id: '10',
        type: 'eco-read',
        name: 'Sustainable Tourism Bookshop',
        description: 'Eco-travel guides and environmental literature',
        price: 'R50-200/book',
        rating: 4.4,
        walkingDistance: '3 min walk',
        image: '/placeholder.svg'
      }
    ];

    setGeneratedItinerary(mockItinerary);
    addBotMessage(`🎯 **Ready for your interactive itinerary!**

I've created a complete ${duration} itinerary with:
• 1 central eco-friendly accommodation
• 3 restaurant options within walking distance
• 3 curated activities and experiences
• 3 eco-reading locations for cultural immersion

Click "View Interactive Itinerary" below to see your timeline view with direct booking options!

You can also continue chatting with me to modify your itinerary or ask questions. 🌿`);
    
    setShowItinerary(true);
    setCurrentStep(conversationSteps.length); // Mark conversation as complete
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderSuggestionButton = (suggestion: string, index: number) => (
    <button
      key={index}
      onClick={() => handleSuggestionClick(suggestion)}
      className="inline-flex items-center px-3 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-800 rounded-full border border-green-200 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
    >
      <Leaf className="h-3 w-3 mr-1 flex-shrink-0" />
      <span className="truncate">{suggestion}</span>
    </button>
  );

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-green-300 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && !showVisualBuilder && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-green-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Terrabook Travel Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-green-900 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Suggestion Chips */}
            {showSuggestions && getCurrentSuggestions().length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg rounded-bl-none shadow-sm border p-3 max-w-[80%]">
                  <div className="flex flex-wrap gap-2">
                    {getCurrentSuggestions().map((suggestion, index) => 
                      renderSuggestionButton(suggestion, index)
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm border p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            {showItinerary && (
              <Button
                onClick={() => setShowVisualBuilder(true)}
                className="w-full mb-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-700 hover:to-green-900 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Interactive Itinerary
              </Button>
            )}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={showItinerary ? "Ask me to modify your itinerary..." : "Type your message..."}
                className="flex-1 border-gray-300 focus:border-blue-500"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-500 hover:bg-green-600 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Builder Interface */}
      {isOpen && showVisualBuilder && (
        <div className="fixed inset-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <ItineraryVisualBuilder
            itinerary={generatedItinerary}
            view={selectedView}
            onViewChange={setSelectedView}
            onBack={() => setShowVisualBuilder(false)}
          />
        </div>
      )}
    </>
  );
};

export default TravelChatbot;