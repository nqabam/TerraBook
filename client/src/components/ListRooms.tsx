import { useState } from "react";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ListRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const rooms = [
    {
      id: 1,
      name: "Ocean View Double",
      type: "Double Bed",
      facilities: "Sea View, Room Service, Free WiFi",
      pricePerNight: "R100",
      status: "Available"
    },
    {
      id: 2,
      name: "Mountain Suite",
      type: "Luxury Room",
      facilities: "Mountain View, Spa Access, Mini Bar",
      pricePerNight: "R200",
      status: "Occupied"
    },
    {
      id: 3,
      name: "Family Paradise",
      type: "Family Suite",
      facilities: "Sea View, Balcony, Coffee Machine",
      pricePerNight: "R400",
      status: "Available"
    },
    {
      id: 4,
      name: "Cozy Single",
      type: "Single Bed",
      facilities: "Mountain View, Free WiFi, TV",
      pricePerNight: "R120",
      status: "Available"
    },
    {
      id: 5,
      name: "Executive Double",
      type: "Double Bed",
      facilities: "Room Service, Air Conditioning, Safe",
      pricePerNight: "R370",
      status: "Maintenance"
    }
  ];

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Room Listings</h1>
        <p className="text-gray-600 mt-2">
          Manage all your property rooms in one place. View, edit, and update room information 
          to keep your listings current and attractive to potential guests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Rooms</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-600">{room.type}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{room.facilities}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{room.pricePerNight}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>💡 Pro Tip:</strong> Keep your room information updated regularly to attract more bookings. 
          High-quality photos and detailed descriptions help guests make informed decisions.
        </p>
      </div>
    </div>
  );
};

export default ListRooms;