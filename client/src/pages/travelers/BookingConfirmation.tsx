import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Separator } from "@/components/ui/travelersUI/separator";
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  Phone,
  Download,
  Share2,
  Home,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import type { Booking, Listing } from "@shared/schema";

export default function BookingConfirmation() {
  const { id } = useParams();

  // Fetch booking details
  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ['/api/bookings', id],
    enabled: !!id,
  });

  // Fetch listing details
  const { data: listing } = useQuery<Listing>({
    queryKey: ['/api/listings/details', booking?.listingId],
    enabled: !!booking?.listingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading confirmation details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-terra-darker mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The booking confirmation you're looking for doesn't exist.
            </p>
            <Link href="/trips">
              <Button className="bg-terra-primary hover:bg-terra-dark text-white">
                View My Trips
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contactInfo = booking.contactInfo as { email?: string; phone?: string } || {};

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-terra-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-terra-darker mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking has been successfully confirmed. We've sent you a confirmation email.
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main Booking Info */}
          <Card className="border-terra-light">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-terra-primary" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-terra-darker mb-1">
                  Booking Reference
                </h3>
                <p className="text-gray-600 font-mono">
                  #{booking.id.slice(-8).toUpperCase()}
                </p>
              </div>

              {listing && (
                <div>
                  <h3 className="font-semibold text-terra-darker mb-1">
                    Property
                  </h3>
                  <p className="text-gray-700">{listing.title}</p>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                </div>
              )}

              {booking.checkIn && booking.checkOut && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-terra-darker mb-1">
                      Check-in
                    </h3>
                    <p className="text-gray-600">
                      {format(new Date(booking.checkIn), "EEEE, MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-terra-darker mb-1">
                      Check-out
                    </h3>
                    <p className="text-gray-600">
                      {format(new Date(booking.checkOut), "EEEE, MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-terra-darker mb-1">
                  Guests
                </h3>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-terra-darker mb-1">
                  Status
                </h3>
                <Badge 
                  variant="secondary"
                  className={`${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Payment Info */}
          <Card className="border-terra-light">
            <CardHeader>
              <CardTitle>Contact & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-terra-darker mb-2">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {contactInfo.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{contactInfo.email}</span>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{contactInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-terra-darker mb-2">
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-semibold">R{booking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <Badge 
                      variant="secondary"
                      className={`${
                        booking.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-terra-darker mb-1">
                      Special Requests
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {booking.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant="outline"
            className="border-terra-light text-terra-primary hover:bg-terra-light"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Confirmation
          </Button>
          
          <Button
            variant="outline"
            className="border-terra-light text-terra-primary hover:bg-terra-light"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Booking
          </Button>
          
          <Button
            variant="outline"
            className="border-terra-light text-terra-primary hover:bg-terra-light"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Host
          </Button>
        </div>

        {/* What's Next */}
        <Card className="border-terra-light">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-terra-darker mb-2">
                  Before Your Trip
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Check your email for detailed confirmation</li>
                  <li>• Review the property's check-in instructions</li>
                  <li>• Plan your sustainable travel route</li>
                  <li>• Pack eco-friendly essentials</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-terra-darker mb-2">
                  Need Help?
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Contact our 24/7 support team</li>
                  <li>• Message your host directly</li>
                  <li>• Visit our help center</li>
                  <li>• Check our cancellation policy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/">
            <Button 
              variant="outline"
              className="border-terra-light text-terra-primary hover:bg-terra-light"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="/trips">
            <Button className="bg-terra-primary hover:bg-terra-dark text-white">
              View All My Trips
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
