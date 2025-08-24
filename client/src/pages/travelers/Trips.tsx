import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/travelersUI/tabs";
import { Input } from "@/components/ui/travelersUI/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/travelersUI/select";

import { 
  Calendar, 
  MapPin, 
  Users, 
  Search,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  MessageCircle
} from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";

import type { Booking } from "@shared/schema";

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch user's bookings
  const { data: bookings = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  // Filter and sort bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-asc":
        if (!a.checkIn || !b.checkIn) return 0;
        return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
      case "date-desc":
        if (!a.checkIn || !b.checkIn) return 0;
        return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Categorize bookings
  const today = new Date();
  const upcomingBookings = sortedBookings.filter(booking => {
    if (!booking.checkIn) return false;
    return isAfter(new Date(booking.checkIn), today);
  });
  const pastBookings = sortedBookings.filter(booking => {
    if (!booking.checkOut) return false;
    return isBefore(new Date(booking.checkOut), today);
  });
  const currentBookings = sortedBookings.filter(booking => 
    booking.checkIn && booking.checkOut &&
    isBefore(new Date(booking.checkIn), today) && 
    isAfter(new Date(booking.checkOut), today)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card key={booking.id} className="border-green-200 hover:border-green-600 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">
              Booked on {booking.createdAt ? format(new Date(booking.createdAt), "MMM d, yyyy") : 'N/A'}
            </p>
          </div>
          <Badge className={`${getStatusColor(booking.status || 'pending')} flex items-center gap-1`}>
            {getStatusIcon(booking.status || 'pending')}
            {booking.status || 'pending'}
          </Badge>
        </div>

        <div className="space-y-3">
          {booking.checkIn && booking.checkOut && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {booking.checkIn ? format(new Date(booking.checkIn), "MMM d") : 'N/A'} - {booking.checkOut ? format(new Date(booking.checkOut), "MMM d, yyyy") : 'N/A'}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-green-600">
              R{booking.totalPrice}
            </span>
            <div className="flex space-x-2">
              <Link href={`/confirmation/${booking.id}`}>
                <Button variant="outline" size="sm" className="border-green-200">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-green-200">
                <MessageCircle className="w-4 h-4 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-16 md:pb-0">
        <div className="text-gray-500">Loading your trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-16 md:pb-0">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Trips
            </h2>
            <p className="text-gray-600 mb-4">
              There was a problem loading your trips. Please try again.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-green-600" />
                My Trips
              </h1>
              <p className="text-gray-600 mt-1">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} total
              </p>
            </div>
            
            <Link href="/explore">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Book New Trip
              </Button>
            </Link>
          </div>

          {/* Filters */}
          {bookings.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-green-200">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-600"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 border-green-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-green-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Recently Booked</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="date-asc">Trip Date (Soon)</SelectItem>
                    <SelectItem value="date-desc">Trip Date (Latest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No trips yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your sustainable travel journey by booking your first 
              eco-friendly accommodation or activity.
            </p>
            <Link href="/explore">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({sortedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="current">
                Current ({currentBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {sortedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No bookings match your current filters.
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No upcoming trips planned.</p>
                  <Link href="/explore">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                      Book Your Next Adventure
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="current" className="space-y-4">
              {currentBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No current trips in progress.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No completed trips yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}