interface SolarboxLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SolarboxLogo = ({ className = "", size = "md" }: SolarboxLogoProps) => {
  const heights = { sm: 26, md: 34, lg: 46 };
  const h = heights[size];

  return (
    <div
      className={`flex items-center gap-1.5 select-none ${className}`}
      aria-label="SOLARBOX"
      role="img"
      style={{ height: h }}
    >
      {/* Sun icon */}
      <svg
        viewBox="0 0 48 48"
        width={h * 0.7}
        height={h * 0.7}
        className="shrink-0"
      >
        <g transform="translate(28, 24)">
          <path
            d="M 0,-12 A 12,12 0 0,0 0,12"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
          />
          {[
            { angle: 180, len: 22 },
            { angle: 150, len: 19 },
            { angle: 210, len: 19 },
            { angle: 135, len: 16 },
            { angle: 225, len: 16 },
            { angle: 120, len: 13 },
            { angle: 240, len: 13 },
          ].map(({ angle, len }, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={Math.cos(rad) * 14}
                y1={Math.sin(rad) * 14}
                x2={Math.cos(rad) * len}
                y2={Math.sin(rad) * len}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>

      {/* B letter */}
      <span
        className="text-foreground shrink-0"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontWeight: 900,
          fontSize: h * 0.85,
          lineHeight: 1,
          letterSpacing: "-0.5px",
          marginTop: h * 0.08,
        }}
      >
        B
      </span>

      {/* SOLARBOX text */}
      <span
        className="shrink-0"
        style={{
          fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
          fontWeight: 900,
          fontSize: h * 0.32,
          lineHeight: 1,
          letterSpacing: "0.5px",
          marginTop: h * 0.04,
        }}
      >
        <span className="text-foreground">SOLAR</span>
        <span className="text-primary">BOX</span>
      </span>
    </div>
  );
};

export default SolarboxLogo;
