import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface BuildMyTripButtonProps {
  children: ReactNode;
}

export default function BuildMyTripButton({ children }: BuildMyTripButtonProps) {
  return (
    <Link to="/build-my-trip">
      {children}
    </Link>
  );
}
