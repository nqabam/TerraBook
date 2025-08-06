import { useState } from "react";
import { Search, Mail, Phone, Star, Calendar, DollarSign, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CustomerManagement = () => {
  const [customers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      totalOrders: 24,
      totalSpent: 1248.50,
      averageRating: 4.8,
      lastVisit: "2024-01-15",
      favoriteItems: ["Organic Caesar Salad", "Sustainable Salmon"],
      dietaryRestrictions: ["Vegetarian"],
      loyaltyPoints: 156,
      customerSince: "2023-06-15"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 234-5678",
      totalOrders: 18,
      totalSpent: 892.25,
      averageRating: 4.6,
      lastVisit: "2024-01-14",
      favoriteItems: ["Plant-Based Burger", "Green Smoothie"],
      dietaryRestrictions: ["Vegan", "Gluten-Free"],
      loyaltyPoints: 89,
      customerSince: "2023-08-22"
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "+1 (555) 345-6789",
      totalOrders: 32,
      totalSpent: 1567.80,
      averageRating: 4.9,
      lastVisit: "2024-01-13",
      favoriteItems: ["Quinoa Bowl", "Fair Trade Coffee"],
      dietaryRestrictions: [],
      loyaltyPoints: 234,
      customerSince: "2023-03-10"
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 456-7890",
      totalOrders: 12,
      totalSpent: 567.40,
      averageRating: 4.5,
      lastVisit: "2024-01-12",
      favoriteItems: ["Grilled Chicken", "Roasted Vegetables"],
      dietaryRestrictions: ["Low-Carb"],
      loyaltyPoints: 45,
      customerSince: "2023-11-05"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return { name: "Gold", color: "bg-yellow-100 text-yellow-800" };
    if (totalSpent >= 500) return { name: "Silver", color: "bg-gray-100 text-gray-800" };
    return { name: "Bronze", color: "bg-orange-100 text-orange-800" };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Customer Management</h2>
          <p className="text-gray-600">Manage your restaurant customers and their preferences</p>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold">
                  ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Repeat Customers</p>
                <p className="text-3xl font-bold">{customers.filter(c => c.totalOrders > 5).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold">
                  {(customers.reduce((sum, c) => sum + c.averageRating, 0) / customers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-6">
        {filteredCustomers.map((customer) => {
          const tier = getCustomerTier(customer.totalSpent);
          return (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={tier.color}>{tier.name}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-bold text-lg">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-600">Total Spent</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-lg">{customer.totalOrders}</p>
                    <p className="text-xs text-gray-600">Total Orders</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-bold text-lg">{customer.averageRating}</span>
                    </div>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-lg">{customer.loyaltyPoints}</p>
                    <p className="text-xs text-gray-600">Loyalty Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Favorite Items:</p>
                    <div className="flex flex-wrap gap-1">
                      {customer.favoriteItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Dietary Restrictions:</p>
                    <div className="flex flex-wrap gap-1">
                      {customer.dietaryRestrictions.length > 0 ? (
                        customer.dietaryRestrictions.map((restriction, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {restriction}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Customer since: {new Date(customer.customerSince).toLocaleDateString()}</span>
                  </div>
                  <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerManagement;