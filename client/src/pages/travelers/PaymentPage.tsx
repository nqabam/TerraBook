import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useAppContext } from "@/context/appContext.tsx";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Separator } from "@/components/ui/travelersUI/separator";
import { Input } from "@/components/ui/travelersUI/input";
import { Label } from "@/components/ui/travelersUI/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/travelersUI/radio-group";
import { Checkbox } from "@/components/ui/travelersUI/checkbox";

import { 
  CreditCard, 
  Lock, 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Shield
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { format, differenceInDays } from "date-fns";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  category: string;
  subcategory: string;
}

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Changed from useLocation to useNavigate
  const { user, isLoaded: authLoaded } = useUser();
  const { getToken, axios } = useAppContext();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  // Billing address
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'South Africa'
  });

  // Get booking details from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined;
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined;
  const guests = parseInt(searchParams.get('guests') || '1');

  // Fetch listing details
  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ['/api/listings', id],
    enabled: !!id,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoaded && !user) {
      toast("Authentication Required", {
        description: "Please log in to complete your payment",
      });
      const redirectPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirect-after-login', redirectPath);
      navigate('/sign-in'); // Changed from setLocation to navigate
    }
  }, [user, authLoaded, navigate, toast]);

  // Calculate booking details
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    return differenceInDays(checkOut, checkIn);
  };

  const calculatePricing = () => {
    if (!listing?.price) return { basePrice: 0, cleaningFee: 0, serviceFee: 0, total: 0 };
    
    const nights = calculateNights();
    const basePrice = parseFloat(listing.price) * nights;
    const cleaningFee = listing.category === 'accommodations' ? 200 : 0;
    const serviceFee = Math.round(basePrice * 0.1); // 10% service fee
    const total = basePrice + cleaningFee + serviceFee;
    
    return { basePrice, cleaningFee, serviceFee, total, nights };
  };

  const pricing = calculatePricing();

  // Payment processing mutation
  const paymentMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      
      const bookingData = {
        listingId: id,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        guests,
        totalAmount: pricing.total,
        paymentMethod,
        billingAddress
      };
      
      const response = await axios.post('/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    },
    onSuccess: (booking) => {
      toast("Payment Successful!", {
        description: "Your booking has been confirmed",
      });
      navigate(`/booking-confirmation/${booking.bookingId}`); // Changed from setLocation to navigate
    },
    onError: (error: any) => {
      console.error("Payment error:", error);
      toast("Payment Failed", {
        description: error.response?.data?.message || "There was an issue processing your payment. Please try again.",
      });
    },
  });

  const handlePayment = async () => {
    if (!agreeToTerms) {
      toast("Terms Required", {
        description: "Please agree to the terms and conditions",
      });
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        toast("Card Details Required", {
        description: "Please fill in all card details",
        });
        return;
      }
    }

    setProcessing(true);
    paymentMutation.mutate();
  };

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/listing/${id}`)} // Changed from setLocation to navigate
            className="mb-4 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to listing
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">You're almost there! Just a few more steps to confirm your booking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-green-600" />
                  Secure Payment
                </CardTitle>
                <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Choose Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-600">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                        <div>
                          <div className="font-medium">Credit or Debit Card</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-600">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center cursor-pointer flex-1">
                        <FaPaypal className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-600">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center cursor-pointer flex-1">
                        <Shield className="w-5 h-5 mr-3 text-gray-600" />
                        <div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-sm text-gray-500">Direct bank transfer (EFT)</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-semibold">Card Details</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          placeholder="John Doe"
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />
                    
                    <h3 className="font-semibold">Billing Address</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="123 Main Street"
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, street: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Cape Town"
                            value={billingAddress.city}
                            onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            placeholder="8001"
                            value={billingAddress.postalCode}
                            onChange={(e) => setBillingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Instructions */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">You'll be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                {/* Bank Transfer Instructions */}
                {paymentMethod === 'bank' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium text-gray-800">Bank Transfer Details</p>
                    <p className="text-sm text-gray-600">You'll receive bank details via email to complete the transfer.</p>
                    <p className="text-sm text-gray-600">Your booking will be confirmed once payment is received (1-3 business days).</p>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the <a href="#" className="text-green-600 hover:underline">terms and conditions</a> and 
                    <a href="#" className="text-green-600 hover:underline"> privacy policy</a>. 
                    I understand the cancellation policy and agree to the total amount shown.
                  </Label>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={processing || paymentMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  {processing || paymentMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay R${pricing.total.toLocaleString()} Now`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Listing Info */}
                <div className="flex space-x-3">
                  <img
                    src={listing.images?.[0] || "/placeholder-image.jpg"}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{listing.title}</h3>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {listing.location}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {listing.subcategory}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  {checkIn && checkOut && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Dates
                      </span>
                      <span>{format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      Guests
                    </span>
                    <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>R{listing.price} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}</span>
                    <span>R{pricing.basePrice.toLocaleString()}</span>
                  </div>
                  
                  {pricing.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>R{pricing.cleaningFee}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>R{pricing.serviceFee}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R{pricing.total.toLocaleString()}</span>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="text-xs text-green-800">
                      <p className="font-medium">Secure Payment</p>
                      <p>Your payment info is protected with bank-level security</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}