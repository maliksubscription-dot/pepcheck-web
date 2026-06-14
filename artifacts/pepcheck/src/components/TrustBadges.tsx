import { ShieldCheck, CheckCircle, Package, Clock } from "lucide-react";

interface TrustBadgesProps {
  verified?: boolean;
  lastVerified?: string | null;
  freeShipping?: boolean;
  availableNow?: boolean;
  size?: "sm" | "md";
}

export function TrustBadges({ verified, lastVerified, freeShipping, availableNow, size = "md" }: TrustBadgesProps) {
  const cls = size === "sm"
    ? "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded"
    : "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md";

  const formatted = lastVerified
    ? new Date(lastVerified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {verified && (
        <span className={`${cls} bg-green-100 text-green-800`}>
          <ShieldCheck className="w-3 h-3" /> Price Verified
        </span>
      )}
      {verified && (
        <span className={`${cls} bg-blue-100 text-blue-800`}>
          <CheckCircle className="w-3 h-3" /> Pharmacy Checked
        </span>
      )}
      {freeShipping && (
        <span className={`${cls} bg-purple-100 text-purple-800`}>
          <Package className="w-3 h-3" /> Free Shipping
        </span>
      )}
      {availableNow && (
        <span className={`${cls} bg-emerald-100 text-emerald-800`}>
          <CheckCircle className="w-3 h-3" /> Available Now
        </span>
      )}
      {formatted && (
        <span className={`${cls} bg-muted text-muted-foreground`}>
          <Clock className="w-3 h-3" /> Updated {formatted}
        </span>
      )}
    </div>
  );
}
