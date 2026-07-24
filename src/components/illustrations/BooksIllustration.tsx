export function BooksIllustration() {
  return (
    <svg
  width="150"
  height="95"
  viewBox="0 0 220 140"
  className="shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Book */}
      <rect
        x="65"
        y="88"
        width="95"
        height="16"
        rx="8"
        fill="#8B5CF6"
      />

      <rect
        x="60"
        y="82"
        width="100"
        height="8"
        rx="4"
        fill="#A78BFA"
      />

      {/* Bottom Book */}
      <rect
        x="78"
        y="102"
        width="92"
        height="14"
        rx="7"
        fill="#C4B5FD"
      />

      {/* Graduation Cap */}

      <polygon
        points="110,25 155,42 110,59 65,42"
        fill="#8B5CF6"
      />

      <rect
        x="93"
        y="42"
        width="34"
        height="20"
        rx="4"
        fill="#A78BFA"
      />

      <line
        x1="155"
        y1="42"
        x2="170"
        y2="72"
        stroke="#C4B5FD"
        strokeWidth="2"
      />

      <circle
        cx="170"
        cy="74"
        r="3"
        fill="#C4B5FD"
      />

      {/* Plant */}

      <rect
        x="185"
        y="82"
        width="18"
        height="24"
        rx="3"
        fill="#4B5563"
      />

      <ellipse
        cx="192"
        cy="66"
        rx="10"
        ry="18"
        fill="#34D399"
        transform="rotate(-18 192 66)"
      />

      <ellipse
        cx="205"
        cy="61"
        rx="9"
        ry="17"
        fill="#6EE7B7"
        transform="rotate(22 205 61)"
      />
    </svg>
  );
}