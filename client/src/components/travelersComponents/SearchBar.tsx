import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

export interface SearchParams {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ location, checkIn, checkOut, guests });
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-2xl ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <Label className="block text-sm font-medium text-terra-darker mb-1">
              Where
            </Label>
            <Input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border-2 border-terra-light rounded-xl focus:border-terra-primary focus:outline-none"
            />
          </div>

          {/* Check In */}
          <div className="relative">
            <Label className="block text-sm font-medium text-terra-darker mb-1">
              Check in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full px-4 py-3 border-2 border-terra-light rounded-xl focus:border-terra-primary hover:border-terra-primary justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check Out */}
          <div className="relative">
            <Label className="block text-sm font-medium text-terra-darker mb-1">
              Check out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full px-4 py-3 border-2 border-terra-light rounded-xl focus:border-terra-primary hover:border-terra-primary justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="relative">
            <Label className="block text-sm font-medium text-terra-darker mb-1">
              Guests
            </Label>
            <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
              <SelectTrigger className="w-full px-4 py-3 border-2 border-terra-light rounded-xl focus:border-terra-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 guest</SelectItem>
                <SelectItem value="2">2 guests</SelectItem>
                <SelectItem value="3">3 guests</SelectItem>
                <SelectItem value="4">4 guests</SelectItem>
                <SelectItem value="5">5+ guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-terra-accent hover:bg-terra-primary text-white font-semibold py-4 rounded-xl transition-colors"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
}
