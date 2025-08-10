import { TrendingUp, DollarSign, Users, Star, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DiningAdminDashboard = () => {
  const stats = [
    { title: "Daily Revenue", value: "$2,450", icon: DollarSign, trend: "+12%" },
    { title: "Orders Today", value: "87", icon: ChefHat, trend: "+8%" },
    { title: "Average Rating", value: "4.7", icon: Star, trend: "+0.2" },
    { title: "Total Customers", value: "1,234", icon: Users, trend: "+15%" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Revenue</span>
                <span className="font-semibold">$15,670</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="font-semibold">$62,840</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="font-semibold">$28.15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="font-semibold">12PM - 2PM, 7PM - 9PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top Selling Item</span>
                <span className="font-semibold">Organic Caesar Salad</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Items Sold Today</span>
                <span className="font-semibold">156 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Menu Items</span>
                <span className="font-semibold">42 active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Prep Time</span>
                <span className="font-semibold">18 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Repeat Customers</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="font-semibold">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="font-semibold">84%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Visit Frequency</span>
                <span className="font-semibold">2.3 times/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Local Ingredients</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Waste Reduction</span>
                <span className="font-semibold">-23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Energy Efficiency</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compost Program</span>
                <span className="font-semibold">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiningAdminDashboard;