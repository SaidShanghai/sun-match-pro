interface SolarboxLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SolarboxLogo = ({ className = "", size = "md" }: SolarboxLogoProps) => {
  const heights = { sm: 28, md: 36, lg: 48 };
  const h = heights[size];
  const svgW = h * 3.6;
  const bFontSize = h * 0.85;
  const textFontSize = h * 0.36;

  return (
    <svg
      viewBox="0 0 360 100"
      width={svgW}
      height={h}
      className={className}
      aria-label="SOLARBOX"
      role="img"
    >
      {/* Sun arc + rays */}
      <g transform="translate(42, 50)">
        {/* Half-circle (sun body) */}
        <path
          d="M 0,-14 A 14,14 0 0,0 0,14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-[hsl(24,95%,53%)]"
          style={{ color: "#F97316" }}
        />
        {/* 7 rays fanning left & up/down */}
        {[
          { angle: 180, len: 28 },
          { angle: 150, len: 24 },
          { angle: 210, len: 24 },
          { angle: 135, len: 20 },
          { angle: 225, len: 20 },
          { angle: 120, len: 16 },
          { angle: 240, len: 16 },
        ].map(({ angle, len }, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * 16;
          const y1 = Math.sin(rad) * 16;
          const x2 = Math.cos(rad) * len;
          const y2 = Math.sin(rad) * len;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F97316"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Bold "B" — premium serif style */}
      <text
        x="80"
        y="72"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontWeight="900"
        fontSize={bFontSize}
        letterSpacing="-1"
        className="fill-foreground"
        style={{ fill: "var(--foreground, #1a1a1a)" }}
      >
        B
      </text>

      {/* SOLAR text */}
      <text
        x="138"
        y="52"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize={textFontSize}
        letterSpacing="1.5"
        className="fill-foreground"
        style={{ fill: "var(--foreground, #1a1a1a)" }}
      >
        SOLAR
      </text>

      {/* BOX text in orange */}
      <text
        x="248"
        y="52"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize={textFontSize}
        letterSpacing="1.5"
        fill="#F97316"
      >
        BOX
      </text>

      {/* Thin baseline accent */}
      <line
        x1="138"
        y1="60"
        x2="310"
        y2="60"
        stroke="#F97316"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
};

export default SolarboxLogo;
