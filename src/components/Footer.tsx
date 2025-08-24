import { Link } from "react-router-dom";
import { Wand2 } from "lucide-react";


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary">C</span>
              </div>
              <span className="text-lg font-bold">Caribe Concierge</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your gateway to luxury experiences in San Pedro, Belize.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/services" className="hover:text-accent-light">All Services</Link></li>
              <li><Link to="/services" className="hover:text-accent-light">Tours & Excursions</Link></li>
              <li><Link to="/services" className="hover:text-accent-light">Golf Cart Rentals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/messages" className="hover:text-accent-light">24/7 AI Assistant</Link></li>
              <li><Link to="/contact" className="hover:text-accent-light">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-accent-light">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Location</h4>
            <p className="text-sm text-primary-foreground/80">
              San Pedro Town
              <br />
              Ambergris Caye, Belize
              <br />
              Central America
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Caribe Concierge. All rights reserved. | Powered by AI Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
