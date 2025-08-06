import { useState } from "react";
import { Clock, CheckCircle, XCircle, Eye, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrdersManagement = () => {
  const [orders] = useState([
    {
      id: "ORD-001",
      customerName: "Sarah Johnson",
      items: ["Organic Caesar Salad", "Sustainable Salmon", "Fair Trade Coffee"],
      total: 52.97,
      status: "preparing",
      orderTime: "2:15 PM",
      estimatedReady: "2:35 PM",
      tableNumber: "7",
      orderType: "dine-in"
    },
    {
      id: "ORD-002",
      customerName: "Mike Chen",
      items: ["Plant-Based Burger", "Sweet Potato Fries"],
      total: 23.98,
      status: "ready",
      orderTime: "2:18 PM",
      estimatedReady: "2:38 PM",
      tableNumber: null,
      orderType: "takeout"
    },
    {
      id: "ORD-003",
      customerName: "Emma Wilson",
      items: ["Quinoa Bowl", "Green Smoothie"],
      total: 18.99,
      status: "new",
      orderTime: "2:20 PM",
      estimatedReady: "2:40 PM",
      tableNumber: null,
      orderType: "delivery",
      deliveryAddress: "123 Oak Street"
    },
    {
      id: "ORD-004",
      customerName: "David Brown",
      items: ["Grilled Chicken", "Roasted Vegetables", "Sparkling Water"],
      total: 34.50,
      status: "completed",
      orderTime: "1:45 PM",
      completedTime: "2:10 PM",
      tableNumber: "12",
      orderType: "dine-in"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-yellow-100 text-yellow-800";
      case "ready": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="h-4 w-4" />;
      case "preparing": return <Clock className="h-4 w-4" />;
      case "ready": return <CheckCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const ordersByStatus = {
    new: orders.filter(o => o.status === "new").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    completed: orders.filter(o => o.status === "completed").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Orders Management</h2>
          <p className="text-gray-600">Track and manage incoming orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print All
          </Button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{ordersByStatus.new}</p>
              <p className="text-sm text-gray-600">New Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{ordersByStatus.preparing}</p>
              <p className="text-sm text-gray-600">Preparing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{ordersByStatus.ready}</p>
              <p className="text-sm text-gray-600">Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{ordersByStatus.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Tabs */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="space-y-4">
          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.orderType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Items:</p>
                      <ul className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time:</p>
                      <p className="text-sm text-gray-600">Ordered: {order.orderTime}</p>
                      {order.estimatedReady && (
                        <p className="text-sm text-gray-600">Ready: {order.estimatedReady}</p>
                      )}
                      {order.completedTime && (
                        <p className="text-sm text-gray-600">Completed: {order.completedTime}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Details:</p>
                      {order.tableNumber && (
                        <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                      )}
                      {order.deliveryAddress && (
                        <p className="text-sm text-gray-600">Address: {order.deliveryAddress}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-3 w-3 mr-1" />
                      Print
                    </Button>
                    {order.status === "new" && (
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Start Preparing
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Mark Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Complete Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersManagement;