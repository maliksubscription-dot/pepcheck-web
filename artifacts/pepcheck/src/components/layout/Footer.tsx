import { Link } from "wouter";
import { Pill } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary mb-4">
              <Pill className="h-5 w-5" />
              <span>Pepcheck</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4 leading-relaxed">
              We bring clinical clarity to the compounded GLP-1 market. Real prices, verified providers, and state-level legality — all in one trusted place.
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-sm">
              Not medical advice. Always consult a licensed healthcare professional before starting any medication.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Compare</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/compare" className="hover:text-primary transition-colors">All Providers</Link></li>
              <li><Link href="/cheapest-tirzepatide" className="hover:text-primary transition-colors">Cheapest Tirzepatide</Link></li>
              <li><Link href="/cheapest-semaglutide" className="hover:text-primary transition-colors">Cheapest Semaglutide</Link></li>
              <li><Link href="/price-tracker" className="hover:text-primary transition-colors">Price Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Explore</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/states" className="hover:text-primary transition-colors">Providers by State</Link></li>
              <li><Link href="/medications" className="hover:text-primary transition-colors">Medications Guide</Link></li>
              <li><Link href="/submit-review" className="hover:text-primary transition-colors">Submit a Review</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">About</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Pepcheck</Link></li>
              <li><Link href="/methodology" className="hover:text-primary transition-colors">Our Methodology</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Pepcheck. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/methodology" className="hover:text-primary transition-colors">Methodology</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
