import { Link, useLocation } from "wouter";
import { Pill, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { href: "/compare?state=TX&sort=price_asc", label: "Compare Providers" },
    { href: "/medications", label: "Medications" },
    { href: "/#learn-section", label: "Learn" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
          <Pill className="h-5 w-5 text-primary" />
          <span>Pepcheck</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {mainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                location === link.href || location.startsWith(link.href + "/")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Button asChild size="sm" className="font-semibold ml-2">
            <Link href="/#signup">
              Stay Updated <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 flex flex-col gap-1">
          {mainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg ${
                location === link.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted/50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-3" onClick={() => setMobileMenuOpen(false)}>
            <Link href="/#signup">Stay Updated</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
