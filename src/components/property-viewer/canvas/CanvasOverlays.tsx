"use client";

export function CanvasInstructions() {
  return (
    <text x={20} y={40} fontSize="14" fill="#10b981" className="font-medium">
      Κάντε κλικ για να προσθέσετε κόμβους • Double-click για ολοκλήρωση
    </text>
  );
}

export function EditModeBanner() {
  return (
    <g className="edit-indicators">
      <text
        x={20}
        y={30}
        fontSize="12"
        fill="#7c3aed"
        className="select-none font-medium"
      >
        ✏️ Λειτουργία Επεξεργασίας
      </text>
    </g>
  );
}