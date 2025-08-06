import { DollarSign, TrendingUp, Users, Eye, BarChart3, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const stats = [
    { title: "Monthly Revenue", value: "$12,450", icon: DollarSign, trend: "+12.5%" },
    { title: "Total Bookings", value: "47", icon: Users, trend: "+8.2%" },
    { title: "Booking Analytics", value: "78%", icon: BarChart3, trend: "+5.1%" },
    { title: "Guest Behavior", value: "4.8", icon: Eye, trend: "+2.3%" },
    { title: "Revenue Growth", value: "+15.2%", icon: TrendingUp, trend: "+3.1%" },
    { title: "Competitive Score", value: "92%", icon: Target, trend: "+4.7%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your property and rooms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">This Month</p>
                  <p className="text-sm text-gray-600">47 bookings</p>
                </div>
                <span className="text-green-600 font-bold">$12,450</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Last Month</p>
                  <p className="text-sm text-gray-600">41 bookings</p>
                </div>
                <span className="text-blue-600 font-bold">$11,200</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Average Per Booking</p>
                  <p className="text-sm text-gray-600">Revenue per guest</p>
                </div>
                <span className="text-purple-600 font-bold">$265</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Behavior Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Avg Stay Duration</span>
                <span className="text-green-600 font-medium">3.2 nights</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Repeat Guests</span>
                <span className="text-blue-600 font-medium">34%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Peak Booking Time</span>
                <span className="text-purple-600 font-medium">Weekend</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Customer Satisfaction</span>
                <span className="text-orange-600 font-medium">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Conversion Rate</span>
                <span className="text-green-600 font-medium">23.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancellation Rate</span>
                <span className="text-red-600 font-medium">8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lead Time (Avg)</span>
                <span className="text-blue-600 font-medium">18 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct Bookings</span>
                <span className="text-purple-600 font-medium">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitive Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Market Position</span>
                <span className="text-green-600 font-medium">#2 in area</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price Competitiveness</span>
                <span className="text-blue-600 font-medium">92% optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Review Score vs Avg</span>
                <span className="text-purple-600 font-medium">+0.6 above</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Occupancy vs Market</span>
                <span className="text-orange-600 font-medium">+12% higher</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;