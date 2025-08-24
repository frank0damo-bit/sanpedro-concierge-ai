import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}
