import { Link, useLocation } from "wouter";
import { Pill, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/compare", label: "Compare Providers" },
    { href: "/medications", label: "Medications Guide" },
    { href: "/submit-review", label: "Submit Review" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
          <Pill className="h-5 w-5 text-primary" />
          <span>Pepcheck</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="font-semibold">
            <Link href="/compare">
              Find Prices <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
            <Link href="/compare">Find Prices</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
