"use client";

export function PolygonEditorInstructions() {
  return (
    <g className="instructions">
      <rect
        x={10}
        y={60}
        width={280}
        height={80}
        fill="white"
        fillOpacity={0.95}
        stroke="#d1d5db"
        strokeWidth={1}
        rx={4}
        className="drop-shadow-sm"
      />
      <text x={20} y={80} fontSize="11" fill="#374151" className="font-medium">
        Οδηγίες Επεξεργασίας:
      </text>
      <text x={20} y={95} fontSize="10" fill="#6b7280">
        • Σύρετε τους κόμβους για μετακίνηση
      </text>
      <text x={20} y={108} fontSize="10" fill="#6b7280">
        • Κλικ στα πράσινα σημεία για προσθήκη κόμβου
      </text>
      <text x={20} y={121} fontSize="10" fill="#6b7280">
        • Δεξί κλικ σε κόμβο για διαγραφή
      </text>
      <text x={20} y={134} fontSize="10" fill="#6b7280">
        • Σύρετε το πολύγωνο για μετακίνηση
      </text>
    </g>
  );
}
