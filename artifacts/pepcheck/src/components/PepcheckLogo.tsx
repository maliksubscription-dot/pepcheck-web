interface PepcheckLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PepcheckLogo({ size = "md", className = "" }: PepcheckLogoProps) {
  const iconSize = size === "sm" ? 18 : size === "lg" ? 28 : 22;
  const textClass = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="3" y="3" width="18" height="18" rx="9"
          transform="rotate(45 12 12)"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="3" y="3" width="18" height="18" rx="9"
          transform="rotate(45 12 12)"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="4.93" y1="12" x2="19.07" y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-bold tracking-tight ${textClass}`}>
        Pepcheck
      </span>
    </span>
  );
}
