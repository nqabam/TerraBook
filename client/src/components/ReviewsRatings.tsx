import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const ReviewsRatings = () => {
  const [reviews] = useState([
    {
      id: 1,
      customerName: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      title: "Amazing sustainability focus!",
      comment: "Love how this restaurant prioritizes local ingredients and sustainable practices. The organic caesar salad was incredibly fresh and flavorful. Staff was knowledgeable about sourcing.",
      menuItem: "Organic Caesar Salad",
      helpful: 12,
      replied: true,
      response: "Thank you Sarah! We're thrilled you appreciate our sustainability efforts. Your feedback motivates us to continue sourcing the best local ingredients."
    },
    {
      id: 2,
      customerName: "Mike Chen",
      rating: 4,
      date: "2024-01-14",
      title: "Great vegan options",
      comment: "The plant-based burger was surprisingly good! Nice to see a restaurant that takes vegan options seriously. Only feedback would be faster service during lunch rush.",
      menuItem: "Plant-Based Burger",
      helpful: 8,
      replied: false
    },
    {
      id: 3,
      customerName: "Emma Wilson",
      rating: 5,
      date: "2024-01-13",
      title: "Consistently excellent",
      comment: "I'm a regular here and the quality never disappoints. The quinoa bowl is my go-to, and I love that they change up seasonal ingredients. Best fair trade coffee in town!",
      menuItem: "Quinoa Bowl",
      helpful: 15,
      replied: true,
      response: "Emma, we're so grateful for your loyalty! It's customers like you who inspire us to keep innovating with seasonal ingredients."
    },
    {
      id: 4,
      customerName: "David Brown",
      rating: 3,
      date: "2024-01-12",
      title: "Good food, room for improvement",
      comment: "Food quality is solid but portion sizes felt small for the price point. Service was friendly but slow. The grilled chicken was cooked perfectly though.",
      menuItem: "Grilled Chicken",
      helpful: 5,
      replied: false
    }
  ]);

  const [filterRating, setFilterRating] = useState("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredReviews = filterRating === "all" 
    ? reviews 
    : reviews.filter(review => review.rating.toString() === filterRating);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleReply = (reviewId: number) => {
    console.log(`Replying to review ${reviewId}:`, replyText);
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reviews & Ratings</h2>
          <p className="text-gray-600">Monitor customer feedback and respond to reviews</p>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating), "h-6 w-6")}
            </div>
            <p className="text-3xl font-bold mb-1">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-xs text-gray-500">{reviews.length} total reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${(count / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-6">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Response Rate</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Reviews Responded</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+5% this week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {getInitials(review.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.customerName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{review.menuItem}</Badge>
                  {review.replied && (
                    <Badge className="bg-green-100 text-green-700">Replied</Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700">{review.comment}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-green-600">
                    <ThumbsUp className="h-3 w-3" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
                {!review.replied && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>

              {/* Existing Reply */}
              {review.replied && review.response && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Restaurant Response</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{review.response}</p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <h4 className="font-medium mb-2">Reply to {review.customerName}</h4>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thank the customer and address their feedback..."
                    rows={3}
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(review.id)}>
                      Send Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsRatings;