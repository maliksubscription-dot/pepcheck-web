interface PepcheckLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PepcheckLogo({ size = "md", className = "" }: PepcheckLogoProps) {
  const imgSize = size === "sm" ? 24 : size === "lg" ? 36 : 28;
  const textClass = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="The Pep Check logo"
        width={imgSize}
        height={imgSize}
        style={{ objectFit: "contain", display: "block" }}
      />
      <span className={`font-bold tracking-tight ${textClass}`}>
        Pepcheck
      </span>
    </span>
  );
}
