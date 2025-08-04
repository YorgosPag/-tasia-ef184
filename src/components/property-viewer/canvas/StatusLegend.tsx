"use client";

const statusColors = {
  'for-sale': '#10b981',
  'for-rent': '#3b82f6',
  'sold': '#ef4444',
  'rented': '#f97316',
  'reserved': '#eab308',
};

const statusLabels = {
  'for-sale': 'Προς Πώληση',
  'for-rent': 'Προς Ενοικίαση',
  'sold': 'Πουλημένο',
  'rented': 'Ενοικιασμένο',
  'reserved': 'Δεσμευμένο',
};

export function StatusLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
      <h4 className="text-xs font-medium mb-2">Κατάσταση Ακινήτων</h4>
      <div className="space-y-1">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
            <span>{statusLabels[status as keyof typeof statusLabels]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}