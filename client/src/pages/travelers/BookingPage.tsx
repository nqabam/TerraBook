import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Input } from "@/components/ui/travelersUI/input";
import { Label } from "@/components/ui/travelersUI/label";
import { Textarea } from "@/components/ui/travelersUI/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/travelersUI/select";
import { Calendar } from "@/components/ui/travelersUI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/travelersUI/popover";
import { Separator } from "@/components/ui/travelersUI/separator";
import { Checkbox } from "@/components/ui/travelersUI/checkbox";

import { 
  CalendarIcon, 
  Users, 
  MapPin, 
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

import type { Listing } from "@shared/schema";

export default function BookingPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'South Africa',
  });
  const [notes, setNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Get booking details from URL params if coming from listing details
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    
    if (checkInParam) setCheckIn(new Date(checkInParam));
    if (checkOutParam) setCheckOut(new Date(checkOutParam));
    if (guestsParam) setGuests(parseInt(guestsParam));
  }, []);

  // Fetch listing details
  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['/api/listings', id],
    enabled: !!id,
  });

  // Handle booking submission
  const handleBookingSubmit = () => {
    console.log('handleBookingSubmit called', { listingCategory: listing?.category, id });
    
    if (!listing) {
      console.error('No listing found');
      return;
    }

    // For accommodations and activities, redirect to payment page
    if (listing.category === 'accommodations' || listing.category === 'activities') {
      console.log('Redirecting to payment page...');
      const params = new URLSearchParams();
      if (checkIn) params.set('checkIn', checkIn.toISOString());
      if (checkOut) params.set('checkOut', checkOut.toISOString());
      if (guests > 1) params.set('guests', guests.toString());
      if (contactInfo.firstName) params.set('firstName', contactInfo.firstName);
      if (contactInfo.lastName) params.set('lastName', contactInfo.lastName);
      if (contactInfo.email) params.set('email', contactInfo.email);
      if (contactInfo.phone) params.set('phone', contactInfo.phone);
      if (contactInfo.address) params.set('address', contactInfo.address);
      if (contactInfo.city) params.set('city', contactInfo.city);
      if (contactInfo.country) params.set('country', contactInfo.country);
      if (notes) params.set('notes', notes);
      
      const queryString = params.toString();
      const paymentUrl = `/payment/${id}${queryString ? `?${queryString}` : ''}`;
      console.log('Navigating to:', paymentUrl);
      setLocation(paymentUrl);
      return;
    }

    // For restaurants, create free reservation directly
    console.log('Creating restaurant reservation...');
    const bookingData = {
      listingId: id,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      guests,
      contactInfo,
      notes,
      status: 'confirmed',
      type: 'reservation'
    };

    console.log('Booking data:', bookingData);
    bookingMutation.mutate(bookingData);
  };

  // Create booking mutation (only for restaurants)
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast.success("Reservation Confirmed! Your table reservation has been successfully created.");
      setLocation(`/confirmation/${booking.id}`);
    },
    onError: (error: Error) => {
      toast.error("Booking Failed: Unable to create reservation. Please try again.");
    },
  });

  const calculateTotalPrice = () => {
    // Restaurants are free reservations
    if (listing?.category === 'restaurants') return 0;
    
    if (!listing?.price || !checkIn || !checkOut) return 0;
    
    const nights = differenceInDays(checkOut, checkIn);
    const basePrice = parseFloat(listing.price) * nights;
    const cleaningFee = listing.category === 'accommodations' ? 200 : 0;
    const serviceFee = 150;
    
    return basePrice + cleaningFee + serviceFee;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', { listing: listing?.category, checkIn, checkOut, contactInfo, agreeToTerms });
    
    if (!listing) {
      toast.error("Listing information not found.");
      return;
    }

    if (listing.category === 'accommodations' && (!checkIn || !checkOut)) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone) {
      toast.error("Please provide your full name, email, and phone number.");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    console.log('All validations passed, calling handleBookingSubmit...');
    // Call the booking handler
    handleBookingSubmit();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading booking details...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Listing Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The listing you're trying to book doesn't exist.
            </p>
            <Button 
              onClick={() => setLocation('/explore')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/listing/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to listing
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {listing.category === 'accommodations' ? 'Complete your booking' :
             listing.category === 'restaurants' ? 'Make your table reservation' :
             'Book your experience'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dates and Guests (Accommodations) */}
              {listing.category === 'accommodations' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Trip</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkIn ? format(checkIn, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkIn}
                              onSelect={setCheckIn}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label>Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOut ? format(checkOut, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Guests</Label>
                      <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Date and Time (Restaurants) */}
              {listing.category === 'restaurants' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Reservation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Time</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 13}, (_, i) => i + 11).map(hour => (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Party Size</Label>
                      <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of people" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activity Date and Participants */}
              {listing.category === 'activities' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Participants</Label>
                      <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of participants" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Participant' : 'Participants'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <p className="text-sm text-gray-600">We'll use this information to confirm your booking</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={contactInfo.lastName}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+27 XX XXX XXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={contactInfo.city}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Cape Town"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={contactInfo.country} onValueChange={(value) => setContactInfo(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Botswana">Botswana</SelectItem>
                          <SelectItem value="Namibia">Namibia</SelectItem>
                          <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                          <SelectItem value="Zambia">Zambia</SelectItem>
                          <SelectItem value="Mozambique">Mozambique</SelectItem>
                          <SelectItem value="Lesotho">Lesotho</SelectItem>
                          <SelectItem value="Swaziland">Swaziland</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    * Required fields
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {listing.category === 'restaurants' ? 'Special Requests' : 'Additional Notes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      listing.category === 'restaurants' 
                        ? "Any dietary requirements, accessibility needs, or special occasions..."
                        : "Any special requests or additional information..."
                    }
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and conditions and privacy policy
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={bookingMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                {bookingMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </div>
                ) : (
                  listing.category === 'restaurants' ? 'Make Reservation' :
                  listing.category === 'accommodations' ? 'Continue to Payment' :
                  'Continue to Payment'
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-green-200">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Listing Info */}
                <div className="flex space-x-3">
                  <img
                    src={listing.images?.[0] || "/api/placeholder/80/80"}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{listing.title}</h3>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {listing.location}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  {checkIn && (
                    <div className="flex justify-between">
                      <span>Date{listing.category === 'accommodations' && checkOut ? 's' : ''}</span>
                      <span>
                        {format(checkIn, 'MMM d')}
                        {listing.category === 'accommodations' && checkOut && ` - ${format(checkOut, 'MMM d')}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>
                      {listing.category === 'restaurants' ? 'Party size' : 
                       listing.category === 'accommodations' ? 'Guests' : 
                       'Participants'}
                    </span>
                    <span>{guests}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                {listing.category !== 'restaurants' && listing.price && (
                  <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>R{listing.price} × {nights || 1} {nights === 1 ? 'night' : 'nights'}</span>
                        <span>R{parseFloat(listing.price) * (nights || 1)}</span>
                      </div>
                      
                      {listing.category === 'accommodations' && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>R200</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Service fee</span>
                          <span>R150</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>R{totalPrice.toLocaleString()}</span>
                    </div>
                  </>
                )}

                {/* Restaurant Free Notice */}
                {listing.category === 'restaurants' && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Reservation Free</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        No payment required. Confirmation will be sent to both you and the restaurant.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}