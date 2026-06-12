import { Link } from "wouter";
import { Pill } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary mb-4">
              <Pill className="h-5 w-5" />
              <span>Pepcheck</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              We bring clinical clarity to the compounded GLP-1 market. Real prices, verified providers, and state-level availability—all in one trusted place.
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-sm">
              Disclaimer: Pepcheck is a comparison platform, not a medical provider. Always consult with a healthcare professional before starting any medication.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/compare" className="hover:text-primary transition-colors">Compare Providers</Link></li>
              <li><Link href="/medications" className="hover:text-primary transition-colors">Medications Guide</Link></li>
              <li><Link href="/submit-review" className="hover:text-primary transition-colors">Submit a Review</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Accuracy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Pepcheck. All rights reserved.</p>
          <p>Built for clarity. Designed for patients.</p>
        </div>
      </div>
    </footer>
  );
}
