import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const ServicesToggleHeader = () => {
  const location = useLocation();
  const [userType, setUserType] = useState<"travelling" | "moving">(
    location.pathname.includes('moving') ? 'moving' : 'travelling'
  );

  return (
    <header className="py-4 bg-background border-b">
      <div className="container mx-auto flex justify-center">
        <div className="p-1 bg-muted rounded-lg">
          <Link to="/book-service">
            <Button
              variant={userType === "travelling" ? "default" : "ghost"}
              onClick={() => setUserType("travelling")}
              className="rounded-md"
            >
              I'm Travelling
            </Button>
          </Link>
          <Link to="/moving-services">
            <Button
              variant={userType === "moving" ? "default" : "ghost"}
              onClick={() => setUserType("moving")}
              className="rounded-md"
            >
              I'm Moving
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ServicesToggleHeader;
