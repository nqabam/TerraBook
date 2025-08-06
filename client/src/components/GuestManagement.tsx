import { useState } from "react";
import { User, Phone, Mail, Calendar, Search, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GuestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock guests data
  const guests = [
    {
      id: "G001",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St, New York, NY",
      joinDate: "2023-06-15",
      totalStays: 8,
      totalSpent: 2400,
      status: "vip",
      lastStay: "2024-01-10",
      rating: 4.8,
      notes: "Prefers room with ocean view"
    },
    {
      id: "G002",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      address: "456 Oak Ave, Los Angeles, CA",
      joinDate: "2023-09-22",
      totalStays: 3,
      totalSpent: 850,
      status: "regular",
      lastStay: "2024-01-12",
      rating: 4.5,
      notes: "Business traveler, early check-in requests"
    },
    {
      id: "G003",
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "+1234567892",
      address: "789 Pine St, Chicago, IL",
      joinDate: "2024-01-05",
      totalStays: 1,
      totalSpent: 320,
      status: "new",
      lastStay: "2024-01-08",
      rating: 5.0,
      notes: "First time guest, traveling with family"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip": return "bg-purple-100 text-purple-800";
      case "regular": return "bg-blue-100 text-blue-800";
      case "new": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guest Management</h2>
          <p className="text-muted-foreground">Manage guest profiles and preferences</p>
        </div>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+180 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Guests</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">7.1% of total guests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Guests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">27.4% repeat rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Guest Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">Based on 856 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guests</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Directory</CardTitle>
          <CardDescription>Complete list of your property guests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Stays</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Last Stay</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{guest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {guest.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{guest.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{guest.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(guest.status)}>
                      {guest.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{guest.totalStays}</TableCell>
                  <TableCell>${guest.totalSpent}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{guest.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{guest.lastStay}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Guest Profile</DialogTitle>
                          <DialogDescription>
                            Complete guest information and stay history
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="profile" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="history">Stay History</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                          </TabsList>
                          <TabsContent value="profile" className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-lg">
                                  {guest.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-semibold">{guest.name}</h3>
                                <Badge className={getStatusColor(guest.status)}>
                                  {guest.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-muted-foreground">{guest.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <p className="text-sm text-muted-foreground">{guest.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Address</label>
                                <p className="text-sm text-muted-foreground">{guest.address}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Member Since</label>
                                <p className="text-sm text-muted-foreground">{guest.joinDate}</p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="history" className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-2xl font-bold">{guest.totalStays}</div>
                                  <p className="text-xs text-muted-foreground">Total Stays</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-2xl font-bold">${guest.totalSpent}</div>
                                  <p className="text-xs text-muted-foreground">Total Spent</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-2xl font-bold">{guest.rating}</div>
                                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>
                          <TabsContent value="preferences" className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Special Notes</label>
                              <p className="text-sm text-muted-foreground mt-1">{guest.notes}</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestManagement;