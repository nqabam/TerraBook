import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/appContext.tsx";
import { toast } from 'sonner';

interface Room {
  _id: string;
  roomName: string;
  roomType: string;
  roomDescription: string;
  pricePerNight: number;
  amenities: string[];
  isAvailable: boolean;
}

const ListRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, axios } = useAppContext();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = await getToken();
      const response = await axios.get("/api/rooms/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setRooms(response.data.rooms);
      } else {
        toast.error("Failed to fetch rooms");
      }
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      toast.error(error.response?.data?.message || "Error loading rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (roomId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const response = await axios.post("/api/rooms/toggle-availability", 
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Room availability updated");
        // Update local state
        setRooms(prevRooms => 
          prevRooms.map(room => 
            room._id === roomId 
              ? { ...room, isAvailable: !currentStatus }
              : room
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to toggle availability");
      }
    } catch (error: any) {
      console.error("Error toggling availability:", error);
      toast.error(error.response?.data?.message || "Error updating availability");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.delete(`/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Room deleted successfully");
        setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
      } else {
        throw new Error(response.data.message || "Failed to delete room");
      }
    } catch (error: any) {
      console.error("Error deleting room:", error);
      toast.error(error.response?.data?.message || "Error deleting room");
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isAvailable: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAvailable 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {isAvailable ? "Available" : "Unavailable"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
            <CardTitle>All Rooms ({rooms.length})</CardTitle>
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
          {filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms found. Add your first room to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{room.roomName}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {room.roomDescription}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{room.roomType?.toLowerCase()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">R{room.pricePerNight}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {room.amenities?.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(room.isAvailable)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(room._id, room.isAvailable)}
                          title={room.isAvailable ? "Mark as unavailable" : "Mark as available"}
                        >
                          {room.isAvailable ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" title="View details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit room">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteRoom(room._id)}
                          title="Delete room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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