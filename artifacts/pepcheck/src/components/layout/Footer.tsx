import { Link } from "wouter";
import { Pill, CheckCircle } from "lucide-react";

const TRUST_ITEMS = [
  "Information checked regularly",
  "Texas availability reviewed",
  "No medical advice provided",
  "Provider details updated monthly",
];

const LEARN_COLUMNS = [
  {
    heading: "Compare",
    links: [
      { href: "/compare?state=TX&sort=price_asc", label: "Compare All Providers" },
      { href: "/cheapest-tirzepatide", label: "Cheapest Tirzepatide in Texas" },
      { href: "/cheapest-semaglutide", label: "Cheapest Semaglutide in Texas" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { href: "/compare?state=TX&sort=price_asc", label: "Texas Beta" },
      { href: "/medications", label: "Medication Guide" },
      { href: "/how-we-verify", label: "How We Verify Providers" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about", label: "About Pepcheck" },
      { href: "/methodology", label: "Our Methodology" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t bg-background">
      {/* Learn hub */}
      <div className="border-b py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Learn More About Pepcheck</h2>
            <p className="text-muted-foreground text-sm max-w-xl mb-5">
              Understand how we compare providers, review pricing, and organise GLP-1 information available in Texas.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_ITEMS.map(item => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {LEARN_COLUMNS.map(col => (
              <div key={col.heading}>
                <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-sm text-primary">
            <Pill className="h-4 w-4" />
            <span>Pepcheck</span>
          </div>
          <p className="text-center text-xs text-muted-foreground/70 max-w-sm">
            Not medical advice. Always consult a licensed healthcare professional before starting any medication.
          </p>
          <p>© {new Date().getFullYear()} Pepcheck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
