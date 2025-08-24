import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const socialLinks = [
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Instagram", url: "https://instagram.com" },
    { name: "Twitter", url: "https://twitter.com" },
  ];

  const companyLinks = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
    { to: "/services", label: "All Services" },
    { to: "/moving-services", label: "Relocation Services" },
  ];

  const servicesLinks = [
    { to: "/service/1", label: "Dining Reservations" },
    { to: "/services", label: "Travel" },
    { to: "/moving-services", label: "Relocation" },
    { to: "/service/4", label: "Private Transportation" },
  ];

  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-of-service", label: "Terms of Service" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">C</span>
                </div>
              <span className="text-xl font-bold">Caribe Concierge</span>
            </Link>
            <p className="text-primary-foreground/80">
              Your expert guide to the best of San Pedro, Belize.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">The Team</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay in the Know</h3>
            <p className="text-primary-foreground/80">
              Sign up for our newsletter to get the latest.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-white/90 text-black placeholder:text-muted-foreground" />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-dark">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Caribe Concierge | Concierge Excellence in San Pedro
          </p>
        </div>
      </div>
    </footer>
  );
}
