import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent } from "@/components/ui/travelersUI/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Current URL: {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}
          </p>
          
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Go Home
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="w-full">
                Explore Listings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}