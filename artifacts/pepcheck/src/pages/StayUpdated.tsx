import { useEffect } from "react";
import { ShieldCheck, Bell } from "lucide-react";

export default function StayUpdated() {
  useEffect(() => {
    const w = "https://tally.so/widgets/embed.js";
    const load = () => {
      if (typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((el: Element) => {
          (el as HTMLIFrameElement).src = (el as HTMLIFrameElement).dataset.tallySrc!;
        });
      }
    };
    if (typeof (window as any).Tally !== "undefined") {
      load();
    } else if (!document.querySelector(`script[src="${w}"]`)) {
      const s = document.createElement("script");
      s.src = w;
      s.onload = load;
      s.onerror = load;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-14 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-foreground/20 mb-5">
            <Bell className="w-4 h-4" />
            Texas Beta
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Stay Updated on GLP-1 Prices in Texas
          </h1>
          <p className="text-primary-foreground/75 text-sm max-w-md mx-auto">
            Get notified when GLP-1 provider pricing changes in Texas. No spam — just the updates that matter.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-muted/30 border-b py-3 px-4">
        <div className="container mx-auto max-w-2xl flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          {[
            "Texas providers only",
            "Price change alerts",
            "New provider notifications",
            "Unsubscribe anytime",
          ].map(item => (
            <span key={item} className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary" /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Tally form */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-xl">
          <iframe
            data-tally-src="https://tally.so/embed/J9BGxo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height={586}
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Stay Updated — Pepcheck"
          />
        </div>
      </section>
    </div>
  );
}
